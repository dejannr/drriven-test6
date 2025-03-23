import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import noUser from '../../photos/nouser.png';

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
    return (
      <div className="initial-loading-container">
        <div className="spinner initial-spinner"></div>
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <>
        <h1>Blog Post Not Found</h1>
        <p>Sorry, we couldn't find the blog post you are looking for.</p>
        <Link href="/news">Back to News</Link>
      </>
    );
  }

  // Component to display the creator information
  const CreatorInfo = ({ creator }) => {
    const name = creator ? `${creator.first_name} ${creator.last_name}` : "Nepoznato";
    const imageSrc =
      creator && creator.image
        ? `data:image/jpeg;base64,${creator.image}`
        : noUser.src;
    return (
      <div className="creator-info">
        <img src={imageSrc} alt="Creator" className="creator-image" />
        <p>{name}</p>
      </div>
    );
  };

  return (
    <>
      <h1 className="drr-breadcrump">
        <Link href="/">Početna</Link> {' > '}
        <Link href="/news">Blog</Link> {' > '}
        <Link href={`/news/${post.slug}`}>{post.title}</Link>
      </h1>
      <div className="single-blog-header">{post.title}</div>
        <div class="single-blog-container">
            <CreatorInfo creator={post.creator}/>
            <p className="short-desc">{post.short_description}</p>
            <div className="single-blog-html-container" dangerouslySetInnerHTML={{__html: post.content}}/>
            <p>
                Created on: {new Date(post.created_at).toLocaleDateString()} | Updated
                on: {new Date(post.updated_at).toLocaleDateString()}
            </p>
            {/* Display the creator information after the blog content */}
            <Link href="/news">Back to News</Link>
        </div>
    </>
  );
}
