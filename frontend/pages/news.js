import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import porscheImg from "../../photos/porsche4.png";
import allCategoryImg from "../../photos/all-category.jpg";
import noUser from '../../photos/nouser.png';

export default function News() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategories, setActiveCategories] = useState(["all"]);

  useEffect(() => {
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
      setActiveCategories(["all"]);
    } else {
      setActiveCategories((prev) => {
        let newActive = prev.includes("all") ? [] : [...prev];
        if (newActive.includes(categoryId)) {
          newActive = newActive.filter(id => id !== categoryId);
        } else {
          newActive.push(categoryId);
        }
        return newActive.length ? newActive : ["all"];
      });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const sortedPosts = [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const newestPost = sortedPosts[0];
  const nextPosts = sortedPosts.slice(1, 4);

  const renderCreatorInfo = (creator) => {
    const name = creator ? `${creator.first_name} ${creator.last_name}` : "Nepoznato";
    const imageSrc = creator && creator.image ? `data:image/jpeg;base64,${creator.image}` : noUser.src;

    return (
      <div className="creator-info">
        <img src={imageSrc} alt="Creator" className="creator-image" />
        <p>{name}</p>
      </div>
    );
  };

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
                  <div className="cover-image-container" style={{ position: 'relative' }}>
                    {newestPost.cover_photo && (
                      <img
                        src={`data:image/jpeg;base64,${newestPost.cover_photo}`}
                        alt="Cover"
                        className="cover-img"
                      />
                    )}
                    {newestPost.categories && newestPost.categories.length > 0 && (
                      <div className="cover-overlay">
                        {newestPost.categories.map((cat) => (
                          <span key={cat.id} className="cover-category">
                            <i class="fa-solid fa-star"></i> {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <h2>{newestPost.title}</h2>
                  <p>{newestPost.short_description}</p>
                  {renderCreatorInfo(newestPost.creator)}
                  <p>
                    Objavljeno: {new Date(newestPost.created_at).toLocaleDateString()}
                  </p>
                  <Link href={`/news/${newestPost.slug}`}>
                    <i className="fa-solid fa-angles-right"></i> Ceo tekst
                  </Link>
                </div>
              )}
            </div>
            <div className="next">
              {nextPosts.map((post) => (
                <div key={post.id} className="drr-blogpost-container">
                  <div className="cover-image-container" style={{ position: 'relative' }}>
                    {post.cover_photo && (
                      <img
                        src={`data:image/jpeg;base64,${post.cover_photo}`}
                        alt="Cover"
                        className="cover-img"
                      />
                    )}
                    {post.categories && post.categories.length > 0 && (
                      <div className="cover-overlay">
                        {post.categories.map((cat) => (
                          <span key={cat.id} className="cover-category">
                            <i class="fa-solid fa-star"></i> {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="right">
                    <h2>{post.title}</h2>
                    <p>{post.short_description}</p>
                    {renderCreatorInfo(post.creator)}
                    <p>
                      Objavljeno: {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <Link href={`/news/${post.slug}`}>
                      <i className="fa-solid fa-angles-right"></i> Ceo tekst
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
