import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { Search, SlidersHorizontal, X, Check, TrendingUp, Sparkles } from 'lucide-react';
import "./RecipeList.css";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const categoryIds = searchParams.get("categories");
  const sortBy = searchParams.get("sort") || "recent";
  const urlSearchQuery = searchParams.get("search"); 
  const maxTime = searchParams.get("maxTime");
  const difficulty = searchParams.get("difficulty");
  const maxIngredients = searchParams.get("maxIngredients");
  const selectedCategories = categoryIds ? categoryIds.split(",").map(Number) : [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categoryIds]);

  useEffect(() => {
    console.log("🚀 Fetching categories...");
    axios.get('http://localhost:8080/api/categories')
      .then(res => {
        console.log("📂 Categories loaded:", res.data);
        const withIcons = res.data.map(cat => ({
          ...cat,
          icon: getIconForCategory(cat.name)
        }));
        setCategories(withIcons);
      })
      .catch(err => {
        console.error("❌ Categories error:", err);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    console.log("🔄 Fetching recipes:", { categoryIds, searchKeyword, page });
    
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        let url;
        
        if (categoryIds) {
          const catId = categoryIds.split(",")[0];
          url = `http://localhost:8080/api/recipes/category/${catId}`;
          console.log("📡 Fetching category:", url);
          
          const res = await axios.get(url);
          let sortedRecipes = [...res.data];
          if (sortBy === "title") {
            sortedRecipes.sort((a, b) => a.title.localeCompare(b.title));
          } else if (sortBy === "cookTime") {
            sortedRecipes.sort((a, b) => (a.cookTime || 0) - (b.cookTime || 0));
          } else {
            sortedRecipes.sort((a, b) => b.id - a.id);
          }
          console.log("✅ Got", res.data.length, "recipes");
          setRecipes(sortedRecipes);
          setTotalPages(1);
        } else {
          url = `http://localhost:8080/api/recipes?page=${page}&size=15&sort=${sortBy}`;
          if (searchKeyword) {
            url += `&keyword=${encodeURIComponent(searchKeyword)}`;
          }
          if (maxTime)        url += `&maxTime=${maxTime}`;
          if (difficulty)     url += `&difficulty=${encodeURIComponent(difficulty)}`;
          if (maxIngredients) url += `&maxIngredients=${maxIngredients}`;
          console.log("📡 Fetching all:", url);
          
          const res = await axios.get(url);
          console.log("✅ Got page", res.data.number + 1, "of", res.data.totalPages);
          setRecipes(res.data.content || []);
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setRecipes([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, [categoryIds, page, searchKeyword, sortBy, maxTime, difficulty, maxIngredients]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    setPage(0);
  };

  useEffect(() => {
    if (urlSearchQuery) {
      setSearchKeyword(urlSearchQuery);
    }
  }, [urlSearchQuery]);

  const toggleCategory = (categoryId) => {
    console.log("🎯 Toggle category:", categoryId);
    const current = selectedCategories;
    const updated = current.includes(categoryId)
      ? current.filter(id => id !== categoryId)
      : [...current, categoryId];

    const params = new URLSearchParams(searchParams);
    if (updated.length > 0) {
      params.set("categories", updated.join(","));
    } else {
      params.delete("categories");
    }
    params.delete("page");
    setPage(0);
    setSearchParams(params);
  };

  const clearSearch = () => {
    setSearchKeyword("");
    setPage(0);
  };

  const clearAllFilters = () => {
    setSearchKeyword("");
    setPage(0);
    setSearchParams({});
  };

  const getIconForCategory = (name) => {
    const icons = {
      // Quick
    "Quick and Easy": "⚡", "Quick & Easy": "⚡",
    // Meals
    "Dinner": "🍽️", "Lunch": "🥙", "Breakfast": "🍳",
    "Non-Veg Breakfast": "🥚", "Veg Breakfast": "🥞",
    // Diet
    "Vegetarian": "🥗", "Vegan": "🌱", "Healthy": "💪",
    "Salads": "🥬", "Low Calorie": "🍃",
    // Proteins
    "Non-Veg": "🍗", "Fish": "🐟", "Egg": "🥚",
    // Carbs / staples
    "Rice": "🍚", "Pasta and Noodles": "🍜",
    // Cooking styles
    "Instant Pot": "🫕", "Soups": "🍲",
    "Starters": "🥟", "Snacks": "🍿",
    "Dessert": "🍰", "Desserts": "🍰",
    // Indian regional
    "Indian": "🇮🇳",
    "North Indian": "🫓",
    "South Indian": "🥥",
    "Bengali": "🐟",
    "Gujarati": "🫙",
    "Maharashtrian": "🌶️",
    "Rajasthani": "🏜️",
    "Punjabi": "🧆",
    "Kerala": "🥥",
    "Goan": "🦐",
    "Mughlai": "🍖",
    "Hyderabadi": "🍛",
    "Chettinad": "🌶️",
    // World cuisines
    "Italian": "🇮🇹", "Mexican": "🇲🇽", "Japanese": "🇯🇵",
    "Chinese": "🇨🇳", "Mediterranean": "🫒", "Thai": "🌿",
    "Korean": "🇰🇷", "Lebanese": "🧆", "Greek": "🫒",
    "American": "🍔", "French": "🥐", "Spanish": "🥘",
    // Misc
    "Recipe": "📖", "Festive": "🎉",
    "Spring": "🌸", "Summer": "☀️", "Autumn": "🍂", "Winter": "❄️",
    };
    return icons[name] || "📁";
  };

  if (loading && recipes.length === 0) {
    return (
      <div className="loading-container-new">
        <div className="loading-spinner-new"></div>
        <p className="loading-text-new">Discovering delicious recipes...</p>
      </div>
    );
  }

  const activeFilterCount = selectedCategories.length + (searchKeyword ? 1 : 0);

  return (
    <div className="recipe-list-wrapper">
      
      {/* HERO SECTION */}
      <section className="recipe-hero-section">
        <div className="recipe-hero-background" />
        
        <div className="recipe-hero-content">
          <div className="recipe-hero-badge">
            <TrendingUp size={16} />
            <span>BROWSE RECIPES</span>
          </div>
          
          <h1 className="recipe-hero-title">
            Find Your Next<br/>Favorite Recipe
          </h1>
          
          <p className="recipe-hero-subtitle">
            Explore our collection of tested recipes from home cooks worldwide
          </p>
        </div>
      </section>

      {/* SEARCH & FILTER BAR */}
      <section className="search-filter-section">
        <div className="search-filter-container">
          
          {/* Search Bar */}
          <div className="search-bar-wrapper">
            <Search size={20} className="search-icon-new" />
            <input
              type="text"
              className="search-input-new"
              placeholder="Search recipes, ingredients, cuisines..."
              value={searchKeyword}
              onChange={handleSearchChange}
            />
            {searchKeyword && (
              <button className="clear-search-new" onClick={clearSearch}>
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <button 
            className="filter-button-new" 
            onClick={() => setShowFilterModal(true)}
          >
            <SlidersHorizontal size={20} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="filter-badge-new">{activeFilterCount}</span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="sort-wrapper-new">
            <label className="sort-label-new">Sort:</label>
            <select 
              className="sort-select-new" 
              value={sortBy} 
              onChange={(e) => {
                const value = e.target.value;
                const params = new URLSearchParams(searchParams);
                params.set("sort", value);
                params.delete("page");
                setPage(0);
                setSearchParams(params);
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="title">Name (A-Z)</option>
              <option value="cookTime">Cook Time</option>
            </select>
          </div>

        </div>
      </section>

      {/* ACTIVE FILTERS */}
      {(selectedCategories.length > 0 || searchKeyword) && (
        <section className="active-filters-section">
          <div className="active-filters-wrapper">
            <div className="active-filters-list">
              <span className="filters-label">Active Filters:</span>
              
              {selectedCategories.map(catId => {
                const category = categories.find(c => c.id === catId);
                return category ? (
                  <span key={catId} className="filter-chip">
                    <span className="filter-chip-icon">{category.icon}</span>
                    <span className="filter-chip-text">{category.name}</span>
                    <button 
                      className="filter-chip-remove" 
                      onClick={() => toggleCategory(catId)}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ) : null;
              })}
              
              {searchKeyword && (
                <span className="filter-chip">
                  <Search size={14} className="filter-chip-icon" />
                  <span className="filter-chip-text">"{searchKeyword}"</span>
                  <button className="filter-chip-remove" onClick={clearSearch}>
                    <X size={14} />
                  </button>
                </span>
              )}
              
              <button className="clear-all-button" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>
          </div>
        </section>
      )}

      {/* FILTER MODAL */}
      {showFilterModal && (
        <div className="filter-modal-overlay-new" onClick={() => setShowFilterModal(false)}>
          <div className="filter-modal-new" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="filter-modal-header-new">
              <h2 className="filter-modal-title-new">Filter Recipes</h2>
              <button 
                className="filter-modal-close-new" 
                onClick={() => setShowFilterModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="filter-modal-body-new">
              <div className="filter-section-new">
                <h3 className="filter-section-title-new">Categories</h3>
                <div className="filter-grid-new">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`filter-option-new ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                      onClick={() => toggleCategory(category.id)}
                    >
                      <span className="filter-option-emoji">{category.icon}</span>
                      <span className="filter-option-name">{category.name}</span>
                      {selectedCategories.includes(category.id) && (
                        <span className="filter-option-check">
                          <Check size={16} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="filter-modal-footer-new">
              <button className="modal-clear-button" onClick={clearAllFilters}>
                Clear All
              </button>
              <button 
                className="modal-apply-button" 
                onClick={() => setShowFilterModal(false)}
              >
                <Sparkles size={18} />
                Apply Filters {selectedCategories.length > 0 && `(${selectedCategories.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS INFO */}
      <section className="results-section">
        <div className="results-container">
          <p className="results-count">
            <span className="results-number">{recipes.length}</span> 
            <span className="results-text">
              {recipes.length === 1 ? 'recipe' : 'recipes'} found
            </span>
          </p>
        </div>
      </section>

      {/* RECIPE GRID */}
      {recipes.length > 0 ? (
        <section className="recipes-section">
          <div className="recipes-grid-new">
            {recipes.map((recipe, idx) => (
              <div 
                key={recipe.id} 
                className="recipe-card-wrapper"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="no-results-section">
          <div className="no-results-card">
            <div className="no-results-icon-new">🔍</div>
            <h3 className="no-results-title-new">No Recipes Found</h3>
            <p className="no-results-text-new">
              Try adjusting your search or filters to discover more recipes
            </p>
            <button className="reset-filters-button" onClick={clearAllFilters}>
              <Sparkles size={18} />
              Reset Filters
            </button>
          </div>
        </section>
      )}

      {/* PAGINATION */}
      {!categoryIds && totalPages > 1 && (
        <section className="pagination-section">
          <div className="pagination-wrapper">
            <button
              className="pagination-btn"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              ← Previous
            </button>
            
            <span className="pagination-info-new">
              Page <span className="pagination-current">{page + 1}</span> of {totalPages}
            </span>
            
            <button
              className="pagination-btn"
              disabled={page === totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </button>
          </div>
        </section>
      )}

    </div>
  );
};

export default RecipeList;  