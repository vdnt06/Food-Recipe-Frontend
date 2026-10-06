import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Clock, Users, ChefHat } from "lucide-react";
import { addBookmark, removeBookmark, isBookmarked } from "../lib/bookmarks";
import "./RecipeCard.css";

export default function RecipeCard({ recipe }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(recipe.id));
  }, [recipe.id]);

  const toggleBookmark = (e) => {
    e.preventDefault();
    if (bookmarked) {
      removeBookmark(recipe.id);
      setBookmarked(false);
    } else {
      addBookmark(recipe.id);
      setBookmarked(true);
    }
  };

  // Get the image URL from backend - adjust these property names based on your backend response
  const imageUrl = recipe.imageUrl || recipe.image || recipe.img || "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div className="recipe-card">
      <Link to={`/recipes/${recipe.id}`} className="recipe-card-link">
        {/* Image Section */}
        <div className="recipe-image-container">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="recipe-image"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
            }}
          />
          <div className="image-overlay"></div>
          
          {/* Bookmark Button */}
          <button
            onClick={toggleBookmark}
            className="bookmark-button"
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Heart
              className={`heart-icon ${bookmarked ? "bookmarked" : ""}`}
            />
          </button>

          {/* Category Badge */}
          {recipe.category && (
            <div className="category-badge">
              <ChefHat className="badge-icon" />
              <span>{typeof recipe.category === 'object' ? recipe.category.name : recipe.category}</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="recipe-content">
          <h3 className="recipe-title">{recipe.title}</h3>
          
          <p className="recipe-description">
            {recipe.description}
          </p>

          {/* Meta Information */}
          <div className="recipe-meta">
            {(recipe.prepTime || recipe.prepareTime || recipe.cookingTime) && (
              <div className="meta-item">
                <Clock className="meta-icon" />
                <span>{recipe.prepTime || recipe.prepareTime || recipe.cookingTime}m</span>
              </div>
            )}
            {recipe.servings && (
              <div className="meta-item">
                <Users className="meta-icon" />
                <span>{typeof recipe.servings === 'object' ? recipe.servings.name || recipe.servings.value : recipe.servings}</span>
              </div>
            )}
            {recipe.difficulty && (
              <div className={`difficulty-badge ${
                typeof recipe.difficulty === 'object' 
                  ? recipe.difficulty.name?.toLowerCase() 
                  : recipe.difficulty?.toLowerCase()
              }`}>
                {typeof recipe.difficulty === 'object' ? recipe.difficulty.name : recipe.difficulty}
              </div>
            )}
          </div>

          {/* View Recipe Link */}
          <div className="view-recipe-container">
            <span className="view-recipe-text">View Recipe</span>
            <svg className="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
}