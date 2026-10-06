import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Search, Clock, ChefHat, TrendingUp, Heart, Play, Star, Sparkles, Zap } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/recipes');
        setRecipes(res.data.content || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hour = new Date().getHours();
const suggestedMood = hour >= 22 || hour < 5 ? "Late Night Cravings" 
  : hour >= 12 && hour <= 13 ? "Quick Under 20 Min" 
  : "Healthy but Tasty";

// const moodCategories = [
//   { mood: "Feeling Lazy",        emoji: "😴", desc: "5-ingredient wonders",    color: "#9b87f5", filter: "maxIngredients=5"  },
//   { mood: "Cooking for Family",  emoji: "👨‍👩‍👧", desc: "Crowd-pleasing favorites", color: "#f59e0b", filter: "difficulty=Easy"    },
//   { mood: "Late Night Cravings", emoji: "🌙", desc: "Midnight snack magic",     color: "#8b5cf6", filter: "maxTime=20"         },
//   { mood: "Healthy but Tasty",   emoji: "🥗", desc: "Guilt-free delicious",     color: "#10b981", filter: "difficulty=Easy"    },
//   { mood: "Quick Under 20 Min",  emoji: "⚡", desc: "Lightning fast meals",     color: "#ef4444", filter: "maxTime=20"         },
// ];

  const whyFeatures = [
    { 
      icon: <ChefHat size={40} />, 
      title: 'Human-Tested Recipes', 
      desc: 'Every recipe is cooked and perfected by real home cooks, not algorithms' 
    },
    { 
      icon: <Zap size={40} />, 
      title: 'Quick & Clear Steps', 
      desc: 'No life stories. Just simple, easy-to-follow instructions that work' 
    },
    { 
      icon: <Play size={40} />, 
      title: 'Hands-Free Cook Mode', 
      desc: 'Full-screen mode designed for messy hands and busy kitchens' 
    },
    { 
      icon: <Heart size={40} />, 
      title: 'Community Favorites', 
      desc: 'See what real people are cooking and loving right now' 
    }
  ];

  const popularTags = ['Quick Dinner', 'Healthy', 'Comfort Food', 'Vegetarian', 'Under 30 min'];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${searchQuery}`);
    }
  };

  const handleMoodClick = (cat) => {
  navigate(`/recipes?${cat.filter}`);
};

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Delicious Recipes...</p>
      </div>
    );
  }

  const trendingRecipes = Array.isArray(recipes) ? recipes.slice(0, 4) : [];

  return (
    <div className="home-wrapper-new">
      
      {/* HERO SECTION */}
      <section className="hero-section-new">
        <div className="hero-background" style={{ transform: `translateY(${scrollY * 0.5}px)` }} />
        
        {/* Floating Ingredients */}
        <div className="floating-ingredient ingredient-1">🍅</div>
        <div className="floating-ingredient ingredient-2">🥑</div>
        <div className="floating-ingredient ingredient-3">🧄</div>

        <div className="hero-content-new">
          {/* Social Proof Badge */}
          <div className="social-proof-badge">
            <span>⭐ Loved by 10,000+ home cooks</span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-title-new">
            Cook Something You'll<br/>Be Proud Of Tonight
          </h1>

          {/* Subheadline */}
          <p className="hero-subtitle-new">
            Real recipes, tested by real home cooks — simple steps, unforgettable flavors.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-buttons">
            <button 
              className="cta-primary-new"
              onClick={() => navigate("/recipes")}
            >
              Find My Recipe <Sparkles size={20} />
            </button>
            <button 
              className="cta-secondary-new"
              onClick={() => navigate("/recipes?sort=trending")}
            >
              Browse Trending
            </button>
          </div>

          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-value">4.8★</div>
              <div className="stat-label">Avg Rating</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">250K+</div>
              <div className="stat-label">Cooked This Month</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span>Scroll for inspiration</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* TRENDING TODAY */}
      <section className="trending-section">
        <div className="section-container">
          <div className="section-header-center">
            <div className="trending-badge">
              <TrendingUp size={18} />
              <span>TRENDING NOW</span>
            </div>
            <h2 className="section-title-large">
              🔥 Trending in Home Kitchens Today
            </h2>
            <p className="section-subtitle-center">
              What everyone's cooking right now
            </p>
          </div>

          <div className="trending-grid">
            {trendingRecipes.map((recipe, idx) => (
              <div 
                key={recipe.id} 
                className="trending-card"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => navigate(`/recipes/${recipe.id}`)}
              >
                <div className="trending-image-wrapper">
                  <img src={recipe.imageUrl} alt={recipe.title} className="trending-image" />
                  <div className="hot-badge">🔥 HOT</div>
                </div>
                <div className="trending-content">
                  <h3 className="trending-title">{recipe.title}</h3>
                  <div className="trending-meta">
                    <span className="meta-item">
                      <Clock size={16} /> {recipe.cookTime}
                    </span>
                    <span>•</span>
                    <span>{recipe.difficulty || 'Easy'}</span>
                    <span>•</span>
                    <span className="rating-item">
                      <Star size={16} fill="#fbbf24" /> {recipe.rating || '4.8'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COOK BY MOOD */}
{/* <section className="mood-section">
  <div className="section-container">
    <div className="section-header-center">
      <h2 className="section-title-large">🍽 Cook by Mood</h2>
      <p className="section-subtitle-center">Because cooking should match how you feel</p>
      
      {/* 👇 ADD Surprise Me button here */}
      {/* <button 
        className="surprise-btn"
        onClick={() => {
          const random = moodCategories[Math.floor(Math.random() * moodCategories.length)];
          handleMoodClick(random);
        }}
      >
        🎲 Surprise Me
      </button>
    </div> */}

    {/* <div className="mood-grid">
      {moodCategories.map((cat, idx) => (
        <div
          key={idx}
          className={`mood-card ${cat.mood === suggestedMood ? 'mood-suggested' : ''}`}
          style={{ 
            animationDelay: `${idx * 0.1}s`,
            '--mood-color': cat.color
          }}
          onClick={() => handleMoodClick(cat)}
        >
          {/* 👇 "Perfect for right now" badge */}
          {/* {cat.mood === suggestedMood && (
            <div className="suggested-badge">✨ Perfect for right now</div>
          )}
          <div className="mood-emoji">{cat.emoji}</div>
          <h3 className="mood-title">{cat.mood}</h3>
          <p className="mood-desc">{cat.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>  */}

      {/* INTERACTIVE SEARCH */}
      <section className="search-section">
        <div className="search-section-container">
          <h2 className="search-title">
            What do you feel like cooking today?
          </h2>
          <p className="search-subtitle">
            Search by ingredient, cuisine, or craving
          </p>

          <div className="search-bar-large">
            <Search size={24} className="search-icon-large" />
            <input
              type="text"
              placeholder="chicken, pasta, healthy dinner..."
              className="search-input-large"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-button-large" onClick={handleSearch}>
              Search <Zap size={18} />
            </button>
          </div>

          <div className="popular-tags">
            {popularTags.map((tag, idx) => (
              <button 
                key={idx} 
                className="tag-button"
                onClick={() => {
                  setSearchQuery(tag);
                   navigate(`/recipes?search=${encodeURIComponent(tag)}`);
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* WHY RECIPEHUB */}
      <section className="why-section">
        <div className="section-container">
          <div className="section-header-center">
            <h2 className="section-title-large">
              Why Home Cooks Love RecipeHub
            </h2>
          </div>

          <div className="why-grid">
            {whyFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="why-card"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="why-icon">{feature.icon}</div>
                <h3 className="why-title">{feature.title}</h3>
                <p className="why-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      

    </div>
  );
};

export default Home;