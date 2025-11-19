from rest_framework.routers import DefaultRouter

from .views import DemoSeedViewSet

router = DefaultRouter()
router.register('election-seed', DemoSeedViewSet, basename='demo-seed')

urlpatterns = router.urls

