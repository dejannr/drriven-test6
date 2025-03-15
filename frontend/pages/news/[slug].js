import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function BlogPostDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return; // Wait until slug is available
    axios
      .get(`http://localhost:8000/api/drr/blogposts/${slug}/`)
      .then((response) => {
        setPost(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching blog post detail:', error);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return (
      <>
        <h1>Blog Post Not Found</h1>
        <p>Sorry, we couldn't find the blog post you are looking for.</p>
        <Link href="/news">
          <a>Back to News</a>
        </Link>
      </>
    );
  }

  return (
    <>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <p>
        Created on: {new Date(post.created_at).toLocaleDateString()} | Updated on: {new Date(post.updated_at).toLocaleDateString()}
      </p>
      <Link href="/news">
        Back to News
      </Link>
    </>
  );
}
