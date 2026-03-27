from django.apps import AppConfig


class MessengerConfig(AppConfig):
    name = "messenger"
    default_auto_field = 'django.db.models.BigAutoField'

    def ready(self):
        import messenger.signals  # noqa
