import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Header.css";
import { useAuth } from '../context/AuthContext';



// Which category names belong to each nav item
// These are matched against your actual DB category names (case-insensitive contains)
const NAV_CATEGORY_MAP = {
  Healthy:  ["Vegan", "Salads", "Low Calorie"],
  Cuisines: ["Indian", "North Indian", "South Indian", "Bengali", "Gujarati",
             "Maharashtrian", "Punjabi", "Rajasthani", "Kerala", "Goan",
             "Mughlai", "Italian", "Mexican", "Japanese", "Chinese", "Mediterranean"],
  Seasonal: ["Spring", "Summer", "Autumn", "Winter", "Festive", "Monsoon"],
};

// const POPULAR_LINKS = [
//   { label: "🔥 Trending Now", href: "/popular/trenrding" },
//   { label: "⭐ Top Rated",    href: "/popular/top-rated" },
//   { label: "👍 Most Liked",   href: "/popular/most-liked" },
//   { label: "📈 This Week",    href: "/popular/this-week" },
// ];

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
  return icons[name] || "🍴";
};


const handleLogout = () => {
  logout();
  setShowProfileMenu(false);
  navigate('/');
};

function NavLinkWithDropdown({ link, categories }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // Build dropdown items dynamically from fetched categories
  let dropdownItems = [];

  if (link.label === "Popular") {
    dropdownItems = POPULAR_LINKS.map((item) => ({
      label: item.label,
      href: item.href,
      categoryId: null,
    }));
  } else {
    const allowedNames = NAV_CATEGORY_MAP[link.label];
    if (allowedNames && categories.length > 0) {
      const matched = categories.filter((c) =>
        allowedNames.some((name) =>
          c.name.toLowerCase().includes(name.toLowerCase())
        )
      );
      dropdownItems = matched.map((c) => ({
        label: `${c.icon} ${c.name}`,
        categoryId: c.id,
      }));
    }
  }

  const hasDropdown = dropdownItems.length > 0;

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    if (hasDropdown) setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleItemClick = (item) => {
    setOpen(false);
    if (item.categoryId != null) {
      // Navigate to RecipeList with ?categories=ID — your existing logic handles the rest!
      navigate(`/recipes?categories=${item.categoryId}`);
    } else if (item.href) {
      navigate(item.href);
    }
  };

  return (
    <div
      className="nav-dropdown-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={link.href}
        className={`nav-link${open ? " nav-link--active" : ""}`}
      >
        <span className="nav-icon">{link.icon}</span>
        <span className="nav-label">{link.label}</span>
        {hasDropdown && (
          <span
            className="nav-chevron"
            style={{
              marginLeft: "4px",
              fontSize: "10px",
              opacity: 0.7,
              display: "inline-block",
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        )}
      </Link>

      {open && hasDropdown && (
        <div className="nav-dropdown">
          <div className="nav-dropdown-arrow" />
          {dropdownItems.map((item, i) => (
            <button
              key={i}
              className="nav-dropdown-item"
              onClick={() => handleItemClick(item)}
            >
              {item.label}
            </button>
          ))}

        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen]           = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [categories, setCategories]           = useState([]);
  const profileMenuRef = useRef(null);
  const {user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Discover", href: "/recipes",     icon: "🔍" },
    // { label: "Popular",  href: "/popular",      icon: "🔥" },
    { label: "Healthy",  href: "/healthy-diet", icon: "🥗" },
    { label: "Cuisines", href: "/cuisine",      icon: "🌍" },
    { label: "Seasonal", href: "/seasonal",     icon: "🍂" },
  ];

  // Fetch categories once — shared with dropdown builder
  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(
          data.map((cat) => ({ ...cat, icon: getIconForCategory(cat.name) }))
        );
      })
      .catch(() => setCategories([]));
  }, []);




  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showProfileMenu]);

  const handleLogout = () => {
  logout();                    
  setShowProfileMenu(false);
};


  return (
    <>
      <header className="header-container">
        <div className="header-content">

          {/* Logo */}
          <Link to="/" className="logo-container">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
              <line x1="6" y1="17" x2="18" y2="17" />
            </svg>
            <span className="logo-text">
              Recipe<span className="logo-accent">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav-desktop">
            {navLinks.map((link) => (
              <NavLinkWithDropdown
                key={link.href}
                link={link}
                categories={categories}
              />
            ))}
          </nav>

          {/* Actions */}
          <div className="actions-container">
            <button
              onClick={() => (window.location.href = "/recipes")}
              className="action-btn icon-emoji"
              aria-label="Search"
              title="Search"
            >
              <span className="emoji-icon">🔍</span>
            </button>

            <Link to="/bookmarks" className="action-btn icon-emoji" aria-label="Bookmarks" title="Saved Recipes">
              <span className="emoji-icon">🔖</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="profile-container" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="action-btn profile-btn icon-emoji"
                aria-label="User profile"
                title="Profile"
              >
                <span className="emoji-icon">👤</span>
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  {isAuthenticated ? (
                    <>
                      <div className="profile-header">
                        <div style={{ width: "32px", height: "32px", padding: "6px", background: "linear-gradient(135deg, #ff6b35, #ff8c42)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                          👤
                        </div>
                        <span className="profile-name">{user?.username}</span>
                      </div>
                      <div className="profile-divider" />
                      <Link to="/bookmarks"    className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>🔖 Bookmarks</Link>
                      <Link to="/settings"     className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>⚙️ Settings</Link>
                      <div className="profile-divider" />
                      <button onClick={handleLogout} className="profile-menu-item logout-btn">
                        <span style={{ fontSize: "16px" }}>🚪</span> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login"  className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>Login</Link>
                      <Link to="/signup" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>Sign Up</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-menu-btn icon-emoji" aria-label="Toggle menu">
              <span className="emoji-icon">{isMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="mobile-nav">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                <span className="mobile-nav-icon">{link.icon}</span>
                <span className="mobile-nav-label">{link.label}</span>
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}