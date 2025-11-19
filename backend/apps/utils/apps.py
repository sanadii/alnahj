from django.apps import AppConfig


class UtilsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.utils'
    verbose_name = 'Utilities'
    
    def ready(self):
        """Import signals when app is ready."""
        import apps.utils.signals  # noqa

