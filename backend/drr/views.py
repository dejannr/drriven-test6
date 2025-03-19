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


@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def blogpost_paginated_list(request):
    # Retrieve the page number from query parameters (default: 1)
    try:
        page = int(request.query_params.get('page', 1))
    except ValueError:
        page = 1

    # Fetch published posts ordered by newest, skip the first 4
    posts = BlogPost.objects.filter(published=True).order_by('-created_at')[4:]

    # Calculate pagination indices for 10 posts per page
    start = (page - 1) * 10
    end = start + 10
    paginated_posts = posts[start:end]

    serializer = BlogPostSerializer(paginated_posts, many=True, context={'request': request})
    return Response(serializer.data)