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
        <div class="drr-loader">
            <svg class="car" width="102" height="40" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(2 1)" stroke="#002742" fill="none" fill-rule="evenodd" stroke-linecap="round"
                   stroke-linejoin="round">
                    <path class="car__body"
                          d="M47.293 2.375C52.927.792 54.017.805 54.017.805c2.613-.445 6.838-.337 9.42.237l8.381 1.863c2.59.576 6.164 2.606 7.98 4.531l6.348 6.732 6.245 1.877c3.098.508 5.609 3.431 5.609 6.507v4.206c0 .29-2.536 4.189-5.687 4.189H36.808c-2.655 0-4.34-2.1-3.688-4.67 0 0 3.71-19.944 14.173-23.902zM36.5 15.5h54.01"
                          stroke-width="3"/>
                    <ellipse class="car__wheel--left" stroke-width="3.2" fill="#FFF" cx="83.493" cy="30.25" rx="6.922"
                             ry="6.808"/>
                    <ellipse class="car__wheel--right" stroke-width="3.2" fill="#FFF" cx="46.511" cy="30.25" rx="6.922"
                             ry="6.808"/>
                    <path class="car__line car__line--top" d="M22.5 16.5H2.475" stroke-width="3"/>
                    <path class="car__line car__line--middle" d="M20.5 23.5H.4755" stroke-width="3"/>
                    <path class="car__line car__line--bottom" d="M25.5 9.5h-19" stroke-width="3"/>
                </g>
            </svg>
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
    const CreatorInfo = ({creator}) => {
        const name = creator ? `${creator.first_name} ${creator.last_name}` : "Nepoznato";
        const imageSrc =
            creator && creator.image
                ? `data:image/jpeg;base64,${creator.image}`
                : noUser.src;
        return (
            <div className="creator-info">
                <img src={imageSrc} alt="Creator" className="creator-image"/>
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
                    backgroundImage: `url(${post.cover_photo})`,
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
