// src/pages/Bookmarks.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, Trash2, BookmarkCheck } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import { getBookmarks, removeBookmark } from "../lib/bookmarks";
import "./Bookmarks.css";

export default function Bookmarks() {
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const bookmarkedIds = getBookmarks();
      console.log("Bookmarked IDs:", bookmarkedIds);
      
      if (bookmarkedIds.length === 0) {
        setBookmarkedRecipes([]);
        setLoading(false);
        return;
      }

      // Fetch all recipes from your API
      const response = await axios.get('http://localhost:8080/api/recipes');
      console.log("API Response:", response.data);
      
      const allRecipes = response.data.content || response.data || [];
      
      // Filter only bookmarked recipes
      const filtered = allRecipes.filter((recipe) =>
        bookmarkedIds.includes(String(recipe.id))
      );
      
      console.log("Filtered recipes:", filtered);
      setBookmarkedRecipes(filtered);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      setError("Failed to load bookmarked recipes. Please try again.");
      setBookmarkedRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = (id) => {
    removeBookmark(id);
    setBookmarkedRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) {
    return (
      <div className="bookmarks-page">
        <div className="bookmarks-container">
          <div className="bookmarks-loading">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your saved recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookmarks-page">
        <div className="bookmarks-container">
          <div className="bookmarks-error">
            <p className="error-text">{error}</p>
            <button onClick={loadBookmarks} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-container">
        
        {/* Header */}
        <div className="bookmarks-header">
          <div className="bookmarks-title-section">
            <div className="bookmarks-icon-wrapper">
              <BookmarkCheck className="bookmarks-icon" />
            </div>
            <div>
              <h1 className="bookmarks-title">Saved Recipes</h1>
              <p className="bookmarks-count">
                {bookmarkedRecipes.length} recipe{bookmarkedRecipes.length !== 1 && "s"} saved
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {bookmarkedRecipes.length > 0 ? (
          <div className="bookmarks-grid">
            {bookmarkedRecipes.map((recipe) => (
              <div key={recipe.id} className="bookmark-card-wrapper">
                <RecipeCard recipe={recipe} />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveBookmark(recipe.id);
                  }}
                  className="remove-bookmark-btn"
                  title="Remove from bookmarks"
                >
                  <Trash2 className="trash-icon" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bookmarks-empty">
            <div className="empty-icon-wrapper">
              <Heart className="empty-icon" />
            </div>
            <h2 className="empty-title">No bookmarked recipes yet</h2>
            <p className="empty-description">
              Start exploring and save your favorite recipes to see them here
            </p>
            <button
              onClick={() => navigate("/recipes")}
              className="explore-button"
            >
              Explore Recipes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}