import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import porscheImg from "../../photos/porsche.png";

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
          <h1 className="drr-breadcrump">Home / News</h1>
          <div class="drr-blog-header">
              <div class="left">
                  <h2>Blog.</h2>
                  <p>Sveobuhvatan prikaz dešavanja, analiza i inovacija u automobilskoj industriji.</p>
              </div>
              <div class="right">
                <img src={porscheImg.src} alt="Porsche"/>
              </div>
          </div>
          {/*TEMP*/}
          <div style={{marginTop: 200 + 'vh'}}></div>
          {posts.map((post) => (
              <div
                  key={post.id} className='drr-blogpost-container'>
                  <h2>{post.title}</h2>
                  <div dangerouslySetInnerHTML={{__html: post.content}}/>
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
