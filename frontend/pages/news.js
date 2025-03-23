import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import porscheImg from "../photos/porsche4.png";
import allCategoryImg from "../photos/all-category.jpg";
import noUser from '../photos/nouser.png';

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
      <div className="blogpost-info">
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

// Component for the other blog posts (.next) with their structure
function OtherBlogPost({ post }) {
  return (
    <div key={post.id} className="drr-blogpost-container">
      <CoverImage coverPhoto={post.cover_photo} categories={post.categories} />
      <div className="blogpost-info">
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
  const [appliedCategories, setAppliedCategories] = useState(["all"]); // stores the applied filter
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

  // Function to fetch paginated posts 10 by 10 (skipping the first 4),
  // now optionally filtered by categories.
  const fetchPaginatedPosts = (page, categoryFilter = ["all"]) => {
    setLoadingPaginated(true);
    let url = `http://localhost:8000/api/drr/blogposts/page/?page=${page}`;
    if (!categoryFilter.includes("all")) {
      url += `&categories=${categoryFilter.join(',')}`;
    }
    axios
      .get(url)
      .then((response) => {
        if (response.data.length < 10) {
          setHasMorePaginated(false);
        }
        setPaginatedPosts((prev) => (page === 1 ? response.data : [...prev, ...response.data]));
        setLoadingPaginated(false);
      })
      .catch((error) => {
        console.error('Error fetching paginated posts:', error);
        setLoadingPaginated(false);
      });
  };

  // Fetch initial paginated posts (page 1) with no filters (or "all")
  useEffect(() => {
    fetchPaginatedPosts(1, appliedCategories);
  }, [appliedCategories]);

  // Function to toggle category selection
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

  // Handler to apply the filters from activeCategories
  const handleApplyFilters = () => {
    setAppliedCategories(activeCategories);
    setCurrentPage(1);
    setHasMorePaginated(true);
    setPaginatedPosts([]);
    fetchPaginatedPosts(1, activeCategories);
  };

  // Handlers for pager controls that now use the appliedCategories filter
  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchPaginatedPosts(nextPage, appliedCategories);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
      fetchPaginatedPosts(1, appliedCategories);
      setHasMorePaginated(true);
    }
  };

  if (loading) {
    return (
      <div className="initial-loading-container">
        <div className="spinner initial-spinner"></div>
        <p>Učitavanje...</p>
      </div>
    );
  }

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
        <div className="drr-blogposts-container-all">
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
          <button onClick={handleApplyFilters} className="apply-filters-btn">
            <i class="fa-solid fa-filter"></i> Primeni Filtere
          </button>
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
        <div className="drr-blogposts-container-all-down">
          {paginatedPosts.map((post) => (
              <OtherBlogPost key={post.id} post={post}/>
          ))}
          {loadingPaginated && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Učitavanje postova...</p>
              </div>
          )}
          {!loadingPaginated && paginatedPosts.length === 0 && (
              <p>Trenutno nema dostupnih blog postova.</p>
          )}
        </div>
        <div className="drr-blogposts-pager">
          {!loadingPaginated && hasMorePaginated && (
              <button onClick={handleNextPage} disabled={loadingPaginated}>
                Učitaj još
              </button>
          )}
          {!loadingPaginated && currentPage > 1 && (
              <button onClick={handlePrevPage} disabled={loadingPaginated}>
                Nazad na početak
              </button>
          )}
        </div>
      </>
  );
}
