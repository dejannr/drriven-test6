import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import porscheImg from "../../photos/porsche2.png";
import allCategoryImg from "../../photos/all-category.jpg";

export default function News() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategories, setActiveCategories] = useState(["all"]); // start with "All" active

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

  const toggleCategory = (categoryId) => {
    if (categoryId === "all") {
      // When "All" is clicked, reset active state to only "all"
      setActiveCategories(["all"]);
    } else {
      setActiveCategories((prev) => {
        let newActive = prev.includes("all") ? [] : [...prev];
        // Toggle non-"All" category
        if (newActive.includes(categoryId)) {
          newActive = newActive.filter(id => id !== categoryId);
        } else {
          newActive.push(categoryId);
        }
        // If no non-"All" categories are active, default back to "all"
        return newActive.length ? newActive : ["all"];
      });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1 className="drr-breadcrump">Početna {'>'} Blog</h1>
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
          {/* "All" category */}
          <div
              key="all"
              className={`category-item ${activeCategories.includes("all") ? 'active' : ''}`}
              onClick={() => toggleCategory("all")}
          >
            <div
                className="category-bg"
                style={{
                  backgroundImage: `url('${allCategoryImg.src}')`,
                  filter: 'grayscale(100%)'
                }}
            ></div>
            <h3>Sve</h3>
          </div>
          {categories.map((category) => (
              <div
                  key={category.id}
                  className={`category-item ${activeCategories.includes(category.id) ? 'active' : ''}`}
                  onClick={() => toggleCategory(category.id)}
              >
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
      <div className="drr-blogposts-container">
        {posts.length > 0 ? (
            posts.map((post) => (
                <div key={post.id} className="drr-blogpost-container">
                  <h2>{post.title}</h2>
                  <div dangerouslySetInnerHTML={{__html: post.content}}/>
                  <p>
                Created on: {new Date(post.created_at).toLocaleDateString()} | Updated on: {new Date(post.updated_at).toLocaleDateString()}
              </p>
              <Link href={`/news/${post.slug}`}>
                Read More
              </Link>
            </div>
          ))
        ) : (
          <p>Trenutno nema dostupnih blog postova.</p>
        )}
      </div>
    </>
  );
}
