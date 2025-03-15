import { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h2>{post.title}</h2>
          {/* Render HTML content */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          <p>
            Created on: {new Date(post.created_at).toLocaleDateString()} | Updated on: {new Date(post.updated_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </>
  );
}
