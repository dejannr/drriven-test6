from django.core.paginator import Paginator
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from .models import BlogPost, BlogPostCategory
from .serializers import BlogPostSerializer, BlogPostCategorySerializer
import time

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def blogpost_list(request):
    time.sleep(5)
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


def blogpost_paginated_list(request):
    page_number = request.GET.get('page', 1)
    categories_param = request.GET.get('categories', None)

    # Start with all published posts ordered by most recent.
    posts = BlogPost.objects.filter(published=True).order_by('-created_at')

    if categories_param and categories_param.lower() != 'all':
        try:
            # Create a list of integers from the comma-separated parameter.
            category_ids = [int(cid) for cid in categories_param.split(',') if cid.isdigit()]
            # Filter posts that have at least one of the provided categories.
            posts = posts.filter(categories__id__in=category_ids).distinct()
        except ValueError:
            pass  # If conversion fails, you could also return an error or ignore the filter.

    # Paginate the queryset: assume 10 posts per page
    paginator = Paginator(posts, 10)
    page_obj = paginator.get_page(page_number)

    # Serialize posts (assuming you have a serializer set up)
    serializer = BlogPostSerializer(page_obj.object_list, many=True)
    return JsonResponse(serializer.data, safe=False)