import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function News() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/drr/blogposts/')
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching blog posts:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!posts.length) {
    return (
      <>
        <h1>News</h1>
        <p>No blog posts available. Check that your backend is running and returning posts.</p>
      </>
    );
  }

  return (
    <>
      <h1>News</h1>
      {posts.map((post) => (
        <div
          key={post.id} className = 'drr-blogpost-container'>
          <h2>{post.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          <p>
            Created on: {new Date(post.created_at).toLocaleDateString()} | Updated on:{' '}
            {new Date(post.updated_at).toLocaleDateString()}
          </p>
          <Link href={`/news/${post.slug}`}>
            Read More
          </Link>
        </div>
      ))}
    </>
  );
}
