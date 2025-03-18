import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import porscheImg from "../../photos/porsche4.png";
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

  // Sort posts by published_at in descending order
  const sortedPosts = [...posts].sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  const newestPost = sortedPosts[0];
  const nextPosts = sortedPosts.slice(1, 4);

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
        <div className="drr-blogpost-title">
          <div className="line"></div>
          <h2>Kategorije</h2>
        </div>
        <div className="drr-blog-categories">
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
        <div className="drr-blogpost-title">
          <div className="line"></div>
          <h2>Najnovije</h2>
        </div>
        <div className="drr-blogposts-container">
          {sortedPosts.length > 0 ? (
              <>
                <div className="first">
                  {newestPost && (
                      <div key={newestPost.id} className="drr-blogpost-container">
                        {newestPost.cover_photo && (
                            <img
                                src={`data:image/jpeg;base64,${newestPost.cover_photo}`}
                                alt="Cover"
                            />
                        )}
                        <h2>{newestPost.title}</h2>
                        <p>
                          Created on: {new Date(newestPost.created_at).toLocaleDateString()} | Updated
                          on: {new Date(newestPost.updated_at).toLocaleDateString()}
                        </p>
                        <Link href={`/news/${newestPost.slug}`}>
                          Read More
                        </Link>
                      </div>
                  )}
                </div>
                <div className="next">
                  {nextPosts.map((post) => (
                      <div key={post.id} className="drr-blogpost-container">
                        <div class="left">
                          {post.cover_photo && (
                              <img
                                  src={`data:image/jpeg;base64,${post.cover_photo}`}
                                  alt="Cover"
                              />
                          )}
                        </div>
                        <div class="right">
                          <h2>{post.title}</h2>
                          <p>
                            Created on: {new Date(post.created_at).toLocaleDateString()} | Updated
                            on: {new Date(post.updated_at).toLocaleDateString()}
                          </p>
                          <Link href={`/news/${post.slug}`}>
                            Read More
                          </Link>
                        </div>
                      </div>
                  ))}
                </div>
              </>
          ) : (
              <p>Trenutno nema dostupnih blog postova.</p>
          )}
        </div>
      </>
  );
}
