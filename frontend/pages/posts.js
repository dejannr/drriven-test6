import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BaseTemplate from '../components/BaseTemplate';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true); // New loading state
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Fetch posts from the Django backend
    axios
      .get('http://localhost:8000/posts/', {
        headers: {
          Authorization: session?.access ? `Bearer ${session.access}` : ''
        }
      })
      .then((response) => {
        setPosts(response.data);
        setLoadingPosts(false); // Set loading to false once posts are loaded
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setLoadingPosts(false); // Set loading to false even if there's an error
      });
  }, [session]);

  const toggleLike = (postId) => {
    if (!session) {
      alert('Please log in to like posts.');
      router.push("/login");
      return;
    }
    axios
      .post(`http://localhost:8000/posts/${postId}/like/`, {}, {
        headers: {
          Authorization: `Bearer ${session.access}`
        }
      })
      .then((response) => {
        // Update the changed post in state with the new data
        const updatedPost = response.data;
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
        );
      })
      .catch((error) => console.error('Error toggling like:', error));
  };

  // Render a loading indicator if either session or posts are still loading
  if (status === 'loading' || loadingPosts) return <BaseTemplate><p>Loading...</p></BaseTemplate>;

  return (
    <BaseTemplate>
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
    </BaseTemplate>
  );
}
