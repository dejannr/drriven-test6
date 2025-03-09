from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from .serializers import PostSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def post_list(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    if post.likes.filter(id=user.id).exists():
        # Already liked; remove the like (unlike)
        post.likes.remove(user)
    else:
        # Add like
        post.likes.add(user)

    serializer = PostSerializer(post, context={'request': request})
    return Response(serializer.data)
