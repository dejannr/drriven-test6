from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from .models import BlogPost, BlogPostCategory
from .serializers import BlogPostSerializer, BlogPostCategorySerializer

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def blogpost_list(request):
    # Only return published posts ordered by newest first, limiting to 4
    posts = BlogPost.objects.filter(published=True).order_by('-created_at')[:4]
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

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def category_list(request):
    categories = BlogPostCategory.objects.all()
    serializer = BlogPostCategorySerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)
