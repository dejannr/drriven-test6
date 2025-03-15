from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from .models import BlogPost
from .serializers import BlogPostSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def blogpost_list(request):
    # Only return published posts
    posts = BlogPost.objects.filter(published=True)
    serializer = BlogPostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def blogpost_detail(request, slug):
    try:
        post = BlogPost.objects.get(slug=slug, published=True)
    except BlogPost.DoesNotExist:
        return Response({'error': 'Blog post not found.'}, status=404)
    serializer = BlogPostSerializer(post, context={'request': request})
    return Response(serializer.data)