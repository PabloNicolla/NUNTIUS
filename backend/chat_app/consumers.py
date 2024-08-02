# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
import json
import redis
import time
import uuid
from .models import ChatMessage

# Initialize the Redis connection
redis_instance = redis.StrictRedis(host='localhost', port=6379, db=0)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f"user_{self.user_id}"

        # self.user = self.scope["user"]

        # # Ensure the user is authenticated
        # if not self.user.is_authenticated:
        #     await self.close()
        #     return

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

        # # Join user's group
        # await self.channel_layer.group_add(
        #     self.group_name,
        #     self.channel_name
        # )

        # Add the new connection
        await self.add_connection()

        await self.accept()
        print(f"User {self.user_id} connected.")

    async def disconnect(self, close_code):
        # Leave user's group
        # await self.channel_layer.group_discard(
        #     self.group_name,
        #     self.channel_name
        # )
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
            confirmation_id = str(await self.save_message(sender_id, receiver_id, data))
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

            await self.channel_layer.send(
                receiver_channel_name,
                {
                    'data': data,
                    'type': message_type,
                    'receiver_id': receiver_id,
                    'sender_id': sender_id,
                    'confirmation_id': confirmation_id
                }
            )
            return

        if message_type in ["private_chat_confirmation"]:
            confirmation_id = message.get('confirmation_id')
            og_sender_channel_name = await self.get_channel_name_for_user(sender_id)
            if not og_sender_channel_name:
                print("no og_sender_channel_name found")
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

        # sender_channel_name = await self.get_channel_name_for_user(sender_id)

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

        # Reply status to sender
        # await self.channel_layer.send(
        #     sender_channel_name,
        #     {
        #         "data": data,
        #         'type': "private_chat_status",
        #         'status': "RECEIVED",
        #     }
        # )

    async def private_chat_status(self, event):
        data = event['data']
        status = event['status']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "data": {"message": data, "status": status},
            "type": "private_chat_status"
        }))

    async def private_chat_batch(self, event):
        data = event['message']

        current_time_js_format = int(time.time() * 1000)
        for message in data:
            message['timestamp'] = current_time_js_format

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "data": data,
            "type": "private_chat_batch"
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
    def save_message(self, sender_id, receiver_id, data):
        message = ChatMessage.objects.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message=data
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
                'message': message.message,
                'timestamp': message.timestamp,
            }
        except ChatMessage.DoesNotExist:
            return None
