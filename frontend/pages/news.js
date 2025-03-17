import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import porscheImg from "../../photos/porsche.png";

export default function News() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch posts and categories concurrently
    Promise.all([
      axios.get('http://localhost:8000/api/drr/blogposts/'),
      axios.get('http://localhost:8000/api/drr/categories/')
    ])
      .then(([postsResponse, categoriesResponse]) => {
        setPosts(postsResponse.data);
        setCategories(categoriesResponse.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
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
          <h1 className="drr-breadcrump">Home {'>'} News</h1>
          <div className="drr-blog-header">
              <div className="left">
                  <h2>Blog.</h2>
                  <p>
                      Platforma namenjena pružanju detaljnih analiza i stručnih komentara o najnovijim dešavanjima u
                      automobilskoj industriji.
                  </p>
              </div>
              <div className="right">
                  <img src={porscheImg.src} alt="Porsche"/>
              </div>
          </div>
          <div className="drr-blog-categories">
              <div className="top">
                  <div className="cont">
                      <div className="line"></div>
                      <h2>Kategorije</h2>
                  </div>
              </div>
              <div className="bot">
                  {categories.map((category) => (
                      <div key={category.id} className="category-item">
                          {category.image && (
                              <div
                                  className="category-bg"
                                  style={{
                                      backgroundImage: `url('data:image/jpeg;base64,${category.image}')`
                                  }}
                              ></div>
                          )}
                          <h3>{category.name}</h3>
                      </div>
                  ))}
              </div>
          </div>
          {/* TEMP spacing */}
          <div style={{marginTop: '200vh'}}></div>
          {posts.map((post) => (
              <div key={post.id} className="drr-blogpost-container">
                  <h2>{post.title}</h2>
                  <div dangerouslySetInnerHTML={{__html: post.content}}/>
                  <p>
                      Created on: {new Date(post.created_at).toLocaleDateString()} | Updated
                      on: {new Date(post.updated_at).toLocaleDateString()}
                  </p>
                  <Link href={`/news/${post.slug}`}>
                      Read More
                  </Link>
              </div>
          ))}
      </>
  );
}
