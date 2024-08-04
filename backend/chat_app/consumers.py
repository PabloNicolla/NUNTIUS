# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
import json
import redis
import time
import uuid
import os
from .models import ChatMessage, ChatConfirmation

redis_instance = redis.StrictRedis(
  host=os.getenv('REDIS_HOST', 'localhost'),
  port=os.getenv('REDIS_PORT', '6379'),
  password=os.getenv('REDIS_PASSWORD', None))

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f"user_{self.user_id}"

        # Generate unique user key
        self.user_key = f"user_{self.user_id}"

        # Get the channel layer
        self.channel_layer = get_channel_layer()

        # Check for existing connection
        existing_channel_name = await self.get_existing_connection()
        if existing_channel_name:
            print("FOUND MATCH", existing_channel_name)
            await self.channel_layer.send(existing_channel_name, {
                "type": "close_connection"
            })

        # Add the new connection
        await self.add_connection()

        await self.accept()
        print(f"User {self.user_id} connected.")

        # Fetch and send stored messages
        await self.fetch_and_send_stored_messages()
        await self.fetch_and_send_stored_confirmations()

    async def disconnect(self, close_code):
        await self.remove_connection()
        print(f"User {self.user_id} disconnected.")

    async def receive(self, text_data):
        print("received it", text_data)
        message = json.loads(text_data)

        message_type = message.get('type')
        data = message.get('data')
        receiver_id = message.get('receiver_id')
        sender_id = message.get('sender_id')

        if not message_type:
            print("Message must have type")
            return
        if not receiver_id:
            print("Message must have receiver_id")
            return
        if not sender_id:
            print("Message must have sender_id")
            return
        if message_type not in ["private_chat", "private_chat_batch", "private_chat_confirmation"]:
            print("message_type not supported")
            return

        if message_type in ["private_chat", "private_chat_batch"]:
            # Store in database to deliver when receiver_id gets online
            confirmation_id = str(await self.save_message(sender_id, receiver_id, data, message_type))
            print("Storing message in db", confirmation_id)

            sender_channel_name = await self.get_channel_name_for_user(sender_id)
            await self.channel_layer.send(
                sender_channel_name,
                {
                    'data': data,
                    'type': 'private_chat_status',
                    'status': 'SENT',
                    'receiver_id': receiver_id,
                    'sender_id': sender_id
                }
            )

            receiver_channel_name = await self.get_channel_name_for_user(receiver_id)
            if receiver_channel_name:
                await self.channel_layer.send(
                    receiver_channel_name,
                    {
                        'data': data,
                        'type': message_type,
                        'receiver_id': receiver_id,
                        'sender_id': sender_id,
                        'confirmation_id': confirmation_id,
                    }
                )
            return

        if message_type in ["private_chat_confirmation"]:
            confirmation_id = message.get('confirmation_id')

            og_sender_channel_name = await self.get_channel_name_for_user(sender_id)
            if not og_sender_channel_name:
                print("no og_sender_channel_name found, saving confirmation")
                await self.save_confirmation(sender_id, receiver_id, data, message_type)
                await self.delete_message(confirmation_id)
                return

            await self.channel_layer.send(
                og_sender_channel_name,
                {
                    'data': data,
                    'type': 'private_chat_status',
                    'status': 'RECEIVED',
                    'receiver_id': receiver_id,
                    'sender_id': sender_id
                }
            )
            await self.delete_message(confirmation_id)

    async def private_chat(self, event):
        data = event['data']
        message_type = 'private_chat'
        receiver_id = event['receiver_id']
        sender_id = event['sender_id']
        confirmation_id = event['confirmation_id']

        current_time_js_format = int(time.time() * 1000)
        data['timestamp'] = current_time_js_format

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'data': data,
            'type': message_type,
            'receiver_id': receiver_id,
            'sender_id': sender_id,
            'confirmation_id': confirmation_id
        }))

    async def private_chat_status(self, event):
        data = event['data']
        message_type = 'private_chat'
        receiver_id = event['receiver_id']
        sender_id = event['sender_id']
        status = event['status']

        if isinstance(data, list):
            message_type = 'private_chat_batch'

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'data': {'message': data, 'status': status, 'message_type': message_type},
            'receiver_id': receiver_id,
            'sender_id': sender_id,
            'type': 'private_chat_status'
        }))

    async def private_chat_batch(self, event):
        data = event['data']
        message_type = 'private_chat_batch'
        receiver_id = event['receiver_id']
        sender_id = event['sender_id']
        confirmation_id = event['confirmation_id']

        current_time_js_format = int(time.time() * 1000)
        for message in data:
            message['timestamp'] = current_time_js_format

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'data': data,
            'type': message_type,
            'receiver_id': receiver_id,
            'sender_id': sender_id,
            'confirmation_id': confirmation_id
        }))

    async def close_connection(self, event):
        await self.close()

    @database_sync_to_async
    def get_existing_connection(self):
        # Use Redis to get existing connection
        return redis_instance.get(self.user_key).decode('utf-8') if redis_instance.get(self.user_key) else None

    @database_sync_to_async
    def add_connection(self):
        # Add the new connection to Redis
        redis_instance.set(self.user_key, self.channel_name)

    @database_sync_to_async
    def remove_connection(self):
        # Remove the connection from Redis
        redis_instance.delete(self.user_key)

    @database_sync_to_async
    def get_channel_name_for_user(self, user_id):
        # Get the channel name for the given user from Redis
        user_key = f"user_{user_id}"
        return redis_instance.get(user_key).decode('utf-8') if redis_instance.get(user_key) else None

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, data, message_type):
        message = ChatMessage.objects.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            data=data,
            message_type=message_type
        )
        return message.id  # Return the UUID of the created message

    @database_sync_to_async
    def delete_message(self, message_id):
        try:
            message = ChatMessage.objects.get(id=message_id)
            message.delete()
            return True
        except ChatMessage.DoesNotExist:
            return False

    @database_sync_to_async
    def get_message(self, message_id):
        try:
            message = ChatMessage.objects.get(id=message_id)
            return {
                'id': message.id,
                'sender_id': message.sender_id,
                'receiver_id': message.receiver_id,
                'data': message.data,
                'timestamp': message.timestamp,
                'message_type': message.message_type,
            }
        except ChatMessage.DoesNotExist:
            return None

    @database_sync_to_async
    def save_confirmation(self, sender_id, receiver_id, data, message_type):
        message = ChatConfirmation.objects.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            data=data,
            message_type=message_type
        )
        return message.id  # Return the UUID of the created ChatConfirmation

    @database_sync_to_async
    def delete_confirmation(self, message_id):
        try:
            message = ChatConfirmation.objects.get(id=message_id)
            message.delete()
            return True
        except ChatConfirmation.DoesNotExist:
            return False

    @database_sync_to_async
    def get_confirmation(self, message_id):
        try:
            message = ChatConfirmation.objects.get(id=message_id)
            return {
                'id': message.id,
                'sender_id': message.sender_id,
                'receiver_id': message.receiver_id,
                'data': message.data,
                'timestamp': message.timestamp,
                'message_type': message.message_type,
            }
        except ChatConfirmation.DoesNotExist:
            return None

    @database_sync_to_async
    def fetch_stored_messages(self, user_id):
        messages = ChatMessage.objects.filter(receiver_id=user_id)
        grouped_messages = {}
        for msg in messages:
            if msg.sender_id not in grouped_messages:
                grouped_messages[msg.sender_id] = []
            if msg.message_type == "private_chat_batch":
                for batch_msg in msg.data:
                    grouped_messages[msg.sender_id].append({
                        'id': str(msg.id),
                        'data': batch_msg,
                    })
            else:
                grouped_messages[msg.sender_id].append({
                    'id': str(msg.id),
                    'data': msg.data,
                })
        return grouped_messages

    async def fetch_and_send_stored_messages(self):
        stored_messages = await self.fetch_stored_messages(self.user_id)
        prev_id = None
        for sender_id, messages in stored_messages.items():
            await self.send(text_data=json.dumps({
                'data': [msg['data'] for msg in messages],
                'type': 'private_chat_batch',
                'receiver_id': str(self.user_id),
                'sender_id': str(sender_id),
                'confirmation_id': str(uuid.uuid4())
            }))
            for msg in messages:
                if prev_id != msg['id']:
                    prev_id = msg['id']
                    await self.delete_message(msg['id'])

    @database_sync_to_async
    def fetch_stored_confirmations(self, user_id):
        confirmations = ChatConfirmation.objects.filter(sender_id=user_id)
        grouped_confirmations = {}
        for conf in confirmations:
            if conf.receiver_id not in grouped_confirmations:
                grouped_confirmations[conf.receiver_id] = []
            if isinstance(conf.data, list):
                for batch_conf in conf.data:
                    grouped_confirmations[conf.receiver_id].append({
                        'id': str(conf.id),
                        'data': batch_conf,
                    })
            else :
                grouped_confirmations[conf.receiver_id].append({
                    'id': str(conf.id),
                    'data': conf.data,
                })
        return grouped_confirmations

    async def fetch_and_send_stored_confirmations(self):
        stored_confirmations = await self.fetch_stored_confirmations(self.user_id)
        prev_id = None
        for receiver_id, confirmations in stored_confirmations.items():
            await self.send(text_data=json.dumps({
                'data': {'message': [conf['data'] for conf in confirmations], 'status': 'RECEIVED', 'message_type': 'private_chat_batch'},
                'type': 'private_chat_status',
                'sender_id': str(self.user_id),
                'receiver_id': str(receiver_id)
            }))
            for conf in confirmations:
                if prev_id != conf['id']:
                    prev_id = conf['id']
                    await self.delete_confirmation(conf['id'])
            