from channels.middleware import BaseMiddleware
import asyncio
from django.conf import settings

timeout_s = settings.WEBSOCKET_TIMEOUT


class TimeoutMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            return await asyncio.wait_for(
                super().__call__(scope, receive, send),
                timeout=timeout_s  # or whatever timeout you prefer
            )
        except asyncio.TimeoutError:
            # Handle the timeout, e.g., close the connection
            await send({"type": "websocket.close"})
