from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.utils.permissions import IsAdminOrAbove
from .models import DemoSeedJob
from .serializers import DemoSeedRequestSerializer, DemoSeedJobSerializer
from .services import DemoSeedService


class DemoSeedViewSet(viewsets.ViewSet):
  permission_classes = [IsAuthenticated, IsAdminOrAbove]

  def create(self, request):
    serializer = DemoSeedRequestSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)

    election = serializer.validated_data['election']
    config = serializer.validated_data['config']

    job = DemoSeedJob.objects.create(
      election=election,
      config=config,
      progress={},
    )

    service = DemoSeedService(job)
    service.run()

    response_serializer = DemoSeedJobSerializer(job)
    return Response(response_serializer.data, status=status.HTTP_201_CREATED)

  def retrieve(self, request, pk=None):
    job = DemoSeedJob.objects.get(pk=pk)
    serializer = DemoSeedJobSerializer(job)
    return Response(serializer.data)

