import React from "react";
import Header from "./components/Header";
import Bookmarks from './pages/Bookmarks';
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RecipeList from "./components/RecipeList";
import RecipeDetail from "./components/RecipeDetail";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./components/Settings";


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* HEADER */}
          <Header />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/my-recipes" element={<MyRecipes />} /> */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/popular" element={<RecipeList />} />
        <Route path="/healthy-diet" element={<RecipeList />} />
        <Route path="/cuisine" element={<RecipeList />} />
        <Route path="/seasonal" element={<RecipeList />} />
              

            
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
