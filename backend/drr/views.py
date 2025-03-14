import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.text import slugify
from .models import BlogPost


@csrf_exempt
def create_blog_post(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)

        title = data.get('title')
        content = data.get('content')

        if not title or not content:
            return JsonResponse({'error': 'Title and content are required.'}, status=400)

        blog_post = BlogPost.objects.create(
            title=title,
            content=content,
            slug=slugify(title)
        )
        return JsonResponse({
            'id': blog_post.id,
            'title': blog_post.title,
            'slug': blog_post.slug,
            'content': blog_post.content,
            'created_at': blog_post.created_at,
            'published': blog_post.published
        }, status=201)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
