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

    // Format date as DD/MM/YYYY
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

  useEffect(() => {
    if (!slug) return; // Wait until slug is available
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/bapi/drr/blogposts/${slug}/`)
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
        <Link href="/blog">Back to News</Link>
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
        <Link href="/blog">Blog</Link> {' > '}
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h1>
        <div
            className="single-blog-header"
            style={{
                position: 'relative',
                backgroundImage: `url(data:image/jpeg;base64,${post.cover_photo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="overlay"></div>
            <div className="overlay2"></div>
            <div style={{position: 'relative', zIndex: 1}}>
                <h2>{post.title}</h2>
            </div>
        </div>
        <div class="single-blog-info-container">
            <p className="short-desc">{post.short_description}</p>
            <div class="cont">
                <CreatorInfo creator={post.creator}/>
                <p className="created-at">Objavljeno: {formatDate(post.created_at)}</p>
            </div>
        </div>
        <div class="single-blog-container-big">
            <div class="left"></div>
            <div className="single-blog-container">
                <div
                    className="single-blog-html-container"
                    dangerouslySetInnerHTML={{__html: post.content}}
                />
            </div>
            <div class="right"></div>
        </div>
        <div class="single-blog-end">
            <Link href="/blog" className="back-button">Nazad na Blog</Link>
        </div>
    </>
  );
}
