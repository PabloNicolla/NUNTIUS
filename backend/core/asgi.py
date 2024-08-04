
import os
import django

# MAKE SURE THAT `os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')`
# AND `django.setup()`
# ARE ABOVE ALL `imports`, EXCEPT FOR `import os` and `import django`

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import chat_app.routing

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            chat_app.routing.websocket_urlpatterns
        )
    ),
})
