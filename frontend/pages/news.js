import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import porscheImg from "../../photos/porsche4.png";
import allCategoryImg from "../../photos/all-category.jpg";
import noUser from '../../photos/nouser.png';

// Component for rendering creator information
function CreatorInfo({ creator }) {
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
}

// Component for rendering the cover image with overlay
function CoverImage({ coverPhoto, categories }) {
  return (
    <div className="cover-image-container" style={{ position: 'relative' }}>
      {coverPhoto && (
        <img
          src={`data:image/jpeg;base64,${coverPhoto}`}
          alt="Cover"
          className="cover-img"
        />
      )}
      {categories && categories.length > 0 && (
        <div className="cover-overlay">
          {categories.map((cat) => (
            <span key={cat.id} className="cover-category">
              <i className="fa-solid fa-star"></i> {cat.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Component for the newest blog post (.first) with its structure
function NewestBlogPost({ post }) {
  return (
    <div key={post.id} className="drr-blogpost-container">
      <CoverImage coverPhoto={post.cover_photo} categories={post.categories} />
        <div class="blogpost-info">
            <h2>{post.title}</h2>
            <p>{post.short_description}</p>
            <CreatorInfo creator={post.creator}/>
            <p>Objavljeno: {new Date(post.created_at).toLocaleDateString()}</p>
            <Link href={`/news/${post.slug}`}>
                <i className="fa-solid fa-angles-right"></i> Ceo tekst
            </Link>
        </div>
    </div>
  );
}

// Component for the other blog posts (.next) with their structure
function OtherBlogPost({post}) {
    return (
        <div key={post.id} className="drr-blogpost-container">
            <CoverImage coverPhoto={post.cover_photo} categories={post.categories}/>
            <div className="right">
        <h2>{post.title}</h2>
        <p>{post.short_description}</p>
        <CreatorInfo creator={post.creator} />
        <p>Objavljeno: {new Date(post.created_at).toLocaleDateString()}</p>
        <Link href={`/news/${post.slug}`}>
          <i className="fa-solid fa-angles-right"></i> Ceo tekst
        </Link>
      </div>
    </div>
  );
}

// Component for rendering a single category item
function CategoryItem({ category, activeCategories, onToggle }) {
  if (category === "all") {
    return (
      <div
        key="all"
        className={`category-item ${activeCategories.includes("all") ? 'active' : ''}`}
        onClick={() => onToggle("all")}
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
    );
  }

  return (
    <div
      key={category.id}
      className={`category-item ${activeCategories.includes(category.id) ? 'active' : ''}`}
      onClick={() => onToggle(category.id)}
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
  );
}

export default function News() {
  const [newestPosts, setNewestPosts] = useState([]);
  const [paginatedPosts, setPaginatedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPaginated, setLoadingPaginated] = useState(false);
  const [activeCategories, setActiveCategories] = useState(["all"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePaginated, setHasMorePaginated] = useState(true);

  // Fetch newest 4 posts and categories on initial load
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8000/api/drr/blogposts/'),
      axios.get('http://localhost:8000/api/drr/categories/')
    ])
      .then(([postsResponse, categoriesResponse]) => {
        setNewestPosts(postsResponse.data);
        setCategories(categoriesResponse.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching newest posts or categories:', error);
        setLoading(false);
      });
  }, []);

  // Function to fetch paginated posts 10 by 10 (skipping the first 4)
  const fetchPaginatedPosts = (page) => {
    setLoadingPaginated(true);
    axios
      .get(`http://localhost:8000/api/drr/blogposts/page/?page=${page}`)
      .then((response) => {
        // If returned posts are less than 10, no more pages available.
        if (response.data.length < 10) {
          setHasMorePaginated(false);
        }
        // For page 1, we set, otherwise append.
        setPaginatedPosts((prev) => (page === 1 ? response.data : [...prev, ...response.data]));
        setLoadingPaginated(false);
      })
      .catch((error) => {
        console.error('Error fetching paginated posts:', error);
        setLoadingPaginated(false);
      });
  };

  // Fetch initial paginated posts (page 1)
  useEffect(() => {
    fetchPaginatedPosts(1);
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

  // Handlers for pager controls
  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchPaginatedPosts(nextPage);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      // For simplicity, we clear and refetch page 1 when going back from page 2.
      // In a full solution you might store each page's data.
      setCurrentPage(1);
      fetchPaginatedPosts(1);
      setHasMorePaginated(true);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // Split newestPosts into the "first" (the very newest) and "next" (the subsequent three)
  const sortedNewest = [...newestPosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const firstPost = sortedNewest[0];
  const nextThreePosts = sortedNewest.slice(1, 4);

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
              <h2>Najnovije</h2>
          </div>
          <div className="drr-blogposts-container">
              {sortedNewest.length > 0 ? (
                  <>
                      <div className="first">
                          {firstPost && <NewestBlogPost post={firstPost}/>}
                      </div>
                      <div className="next">
                          {nextThreePosts.map((post) => (
                              <OtherBlogPost key={post.id} post={post}/>
                          ))}
                      </div>
                  </>
              ) : (
                  <p>Trenutno nema dostupnih blog postova.</p>
              )}
          </div>
          <div className="drr-blogpost-title">
              <div className="line"></div>
              <h2>Sve Objave</h2>
          </div>
          <div className="drr-blog-categories">
              <div className="bot">
                  <CategoryItem category="all" activeCategories={activeCategories} onToggle={toggleCategory}/>
                  {categories.map((cat) => (
                      <CategoryItem
                          key={cat.id}
                          category={cat}
                          activeCategories={activeCategories}
                          onToggle={toggleCategory}
                      />
                  ))}
              </div>
          </div>
          <div className="drr-blogposts-container-down">
              {paginatedPosts.length > 0 ? (
                  paginatedPosts.map((post) => (
                      <OtherBlogPost key={post.id} post={post}/>
                  ))
              ) : (
                  <p>Nema više blogova.</p>
              )}
          </div>
          {/* Pager controls */}
          <div className="pager">
              {currentPage > 1 && (
                  <button onClick={handlePrevPage} disabled={loadingPaginated}>
                      Prethodna strana
                  </button>
              )}
              {hasMorePaginated && (
                  <button onClick={handleNextPage} disabled={loadingPaginated}>
                      Sledeća strana
                  </button>
              )}
          </div>
      </>
  );
}
