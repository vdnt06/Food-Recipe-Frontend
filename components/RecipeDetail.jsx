import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, Clock, Users, ChefHat, Printer, Share2, Heart, ArrowLeft, Flame, Award, Sparkles } from 'lucide-react';
import "./RecipeDetail.css";
import { isBookmarked, toggleBookmark } from '../lib/bookmarks';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [unit, setUnit] = useState('US');
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    if (recipe?.id) {
      setIsBookmarkedState(isBookmarked(recipe.id));
      setIsFavorited(isBookmarked(recipe.id));
    }
  }, [recipe?.id]);

  const fetchRecipe = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/recipes/${id}`);
      setRecipe(res.data);
    } catch (error) {
      console.error("Error loading recipe", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleStep = (index) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSave = () => {
    const newState = toggleBookmark(recipe.id);
    setIsBookmarkedState(newState);
    setIsFavorited(newState);

    if (newState) {
      console.log('Added to bookmarks');
    } else {
      console.log('Removed from bookmarks');
    }
  };

  const StarRating = ({ rating, count }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="star-rating-container">
        <div className="stars">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`star ${i < fullStars ? 'filled' : hasHalfStar && i === fullStars ? 'half' : 'empty'}`}
            />
          ))}
        </div>
        <p className="rating-text">
          <span className="rating-number">{rating.toFixed(1)}</span> ({count} reviews)
        </p>
      </div>
    );
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'difficulty-easy',
      'Medium': 'difficulty-medium',
      'Hard': 'difficulty-hard'
    };
    return colors[difficulty] || 'difficulty-medium';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading delicious recipe...</p>
      </div>
    );
  }

  if (!recipe) return <div className="not-found">Recipe not found</div>;

  const totalTime = (recipe.prepareTime || 0) + (recipe.cookingTime || 0);
  const ingredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients 
    : recipe.ingredients?.split(",").map(i => i.trim()) || [];
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : recipe.instructions?.split(".").filter(s => s.trim()).map(s => s.trim() + ".") || [];

  const checkedCount = Object.values(checkedIngredients).filter(Boolean).length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <div className="recipe-detail-page">
      <div className="recipe-container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate("/recipes")}>
          <ArrowLeft className="icon" />
          Back to Recipes
        </button>

        {/* Hero Card */}
        <div className="hero-card">
          {/* Recipe Image */}
          <div className="hero-image">
            <img src={recipe.imageUrl} alt={recipe.title} />
            <div className="image-overlay" />
            <div className="floating-badge">
              <Sparkles className="badge-icon" />
              <span>Chef's Special</span>
            </div>
          </div>

          {/* Title Section */}
          <div className="hero-content">
            <h1 className="recipe-title">{recipe.title}</h1>
            <div className="divider" />
            <StarRating rating={recipe.averageRating || 5} count={recipe.reviewCount || 0} />
            
            {/* Recipe Meta Info */}
            <div className="meta-info">
              <div className="meta-item">
                <Clock className="icon" />
                <div>
                  <span className="meta-label">TOTAL TIME</span>
                  <span className="meta-value">{totalTime} min</span>
                </div>
              </div>
              <div className="meta-divider"></div>
              <div className="meta-item">
                <Users className="icon" />
                <div>
                  <span className="meta-label">SERVINGS</span>
                  <span className="meta-value">{recipe.servings}</span>
                </div>
              </div>
              <div className="meta-divider"></div>
              <div className="meta-item">
                <Flame className="icon" />
                <div>
                  <span className="meta-label">DIFFICULTY</span>
                  <span className={`meta-value ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty || 'Medium'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn primary" onClick={handlePrint}>
            <Printer className="icon" />
            <span>PRINT</span>
          </button>
          <button className="action-btn primary" onClick={handleShare}>
            <Share2 className="icon" />
            <span>SHARE</span>
          </button>
          <button
            onClick={handleSave}
            className={`action-btn ${isFavorited ? 'favorited' : 'secondary'}`}
          >
            <Heart className={`icon ${isFavorited ? 'filled' : ''}`} />
            <span>{isFavorited ? 'SAVED' : 'SAVE'}</span>
          </button>
        </div>

        {/* Description */}
        {recipe.description && (
          <div className="description-card">
            <p className="description-text">{recipe.description}</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon-wrapper prep">
              <Clock className="info-icon" />
            </div>
            <p className="info-label">Prep Time</p>
            <p className="info-value">{recipe.prepTime || 0} min</p>
          </div>
          <div className="info-card">
            <div className="info-icon-wrapper cook">
              <Flame className="info-icon" />
            </div>
            <p className="info-label">Cook Time</p>
            <p className="info-value">{recipe.cookTime || 0} min</p>
          </div>
          <div className="info-card">
            <div className="info-icon-wrapper servings">
              <Users className="info-icon" />
            </div>
            <p className="info-label">Servings</p>
            <p className="info-value">{recipe.servings}</p>
          </div>
          <div className="info-card">
            <div className="info-icon-wrapper difficulty">
              <Award className="info-icon" />
            </div>
            <p className="info-label">Difficulty</p>
            <p className={`info-value ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty || 'Medium'}
            </p>
          </div>
        </div>

        {/* Recipe Details Grid */}
        <div className="details-grid">
          {/* Ingredients Section */}
          <div className="detail-card ingredients-card">
            <div className="card-header">
              <h2>
                <ChefHat className="icon" />
                INGREDIENTS
              </h2>
              <div className="unit-toggle">
                <button
                  onClick={() => setUnit('US')}
                  className={unit === 'US' ? 'active' : ''}
                >
                  US
                </button>
                <button
                  onClick={() => setUnit('Metric')}
                  className={unit === 'Metric' ? 'active' : ''}
                >
                  Metric
                </button>
              </div>
            </div>
            
            {ingredients.length > 0 && (
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(checkedCount / ingredients.length) * 100}%` }}
                />
                <span className="progress-text">
                  {checkedCount} of {ingredients.length} ingredients
                </span>
              </div>
            )}

            <ul className="ingredients-list">
              {ingredients.map((ingredient, index) => (
                <li 
                  key={index} 
                  className={`ingredient-item ${checkedIngredients[index] ? 'checked' : ''}`}
                  onClick={() => toggleIngredient(index)}
                >
                  <div className="custom-checkbox">
                    <input 
                      type="checkbox" 
                      checked={checkedIngredients[index] || false}
                      onChange={() => toggleIngredient(index)}
                      onClick={(e) => e.stopPropagation()}
                      className="ingredient-checkbox"
                    />
                    <span className="checkmark"></span>
                  </div>
                  <span className="ingredient-text">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions Section */}
          <div className="detail-card instructions-card">
            <div className="card-header">
              <h2>
                <Sparkles className="icon" />
                INSTRUCTIONS
              </h2>
            </div>
            
            {instructions.length > 0 && (
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(completedCount / instructions.length) * 100}%` }}
                />
                <span className="progress-text">
                  Step {completedCount} of {instructions.length}
                </span>
              </div>
            )}

            <ol className="instructions-list">
              {instructions.map((instruction, index) => (
                <li 
                  key={index} 
                  className={`instruction-item ${completedSteps[index] ? 'completed' : ''}`}
                  onClick={() => toggleStep(index)}
                >
                  <div className="step-number-wrapper">
                    <span className="step-number">{index + 1}</span>
                  </div>
                  <p className="step-text">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="tags-card">
            <h3>Recipe Tags</h3>
            <div className="tags-container">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;