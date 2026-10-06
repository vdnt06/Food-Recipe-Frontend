import { Link } from "react-router-dom";
import { Mail, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">🍽️</span>
              </div>
              <span className="font-bold text-lg">Food</span>
            </div>
            <p className="text-gray-300 text-sm">
              Discover amazing recipes from around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Recipes
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Breakfast
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Lunch
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Dinner
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                  Desserts
                </a>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          {/* <div>
            <h3 className="font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-300 text-sm mb-3">
              Get weekly recipe updates in your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:bg-white/20 transition-colors"
              />
              <button className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div> */}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 mb-8">
          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-6">
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom */}
        {/* <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-300 text-sm">
          
          <div className="flex gap-6">
            <a href="#" className="hover:text-orange-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              Contact
            </a>
          </div>
        </div> */}
      </div>
    </footer>
  );
}
