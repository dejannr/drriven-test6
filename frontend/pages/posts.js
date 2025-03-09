import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Wait until the session is fully loaded
    if (status === 'loading') {
      console.log("Session is still loading...");
      return;
    }
    console.log("Session loaded:", session);

    if (!session?.access) {
      console.warn("No access token available. Ensure you're logged in and your token refresh mechanism is working.");
      setLoadingPosts(false);
      return;
    }

    console.log("Fetching posts with access token:", session.access);
    axios
      .get('http://localhost:8000/posts/', {
        headers: { Authorization: `Bearer ${session.access}` }
      })
      .then((response) => {
        console.log("Posts fetched successfully:", response.data);
        setPosts(response.data);
        setLoadingPosts(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setLoadingPosts(false);
      });
  }, [session, status]);

  const toggleLike = (postId) => {
    if (!session?.access) {
      alert('Please log in to like posts.');
      router.push("/login");
      return;
    }
    axios
      .post(`http://localhost:8000/posts/${postId}/like/`, {}, {
        headers: { Authorization: `Bearer ${session.access}` }
      })
      .then((response) => {
        const updatedPost = response.data;
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
        );
      })
      .catch((error) => console.error('Error toggling like:', error));
  };

  if (status === 'loading' || loadingPosts) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  if (!posts.length) {
    return (
      <>
        <h1>Posts</h1>
        <p>No posts available. Check that your backend is running and returning posts.</p>
      </>
    );
  }

  return (
    <>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h2>{post.name}</h2>
          <p>{post.description}</p>
          <p>Likes: {post.likes_count}</p>
          <button onClick={() => toggleLike(post.id)}>
            {post.is_liked ? 'Unlike' : 'Like'}
          </button>
        </div>
      ))}
    </>
  );
}
