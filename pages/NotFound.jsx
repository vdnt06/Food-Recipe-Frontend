import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <ChefHat className="w-20 h-20 mx-auto text-orange-500/30" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          404
        </h1>
        <p className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
          Recipe Not Found
        </p>
        <p className="text-gray-600 text-lg mb-8">
          Looks like this page is still cooking! Let's get you back to the main menu.
        </p>

        <Link
          to="/"
          className="inline-block px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200 hover:shadow-lg"
        >
          Back to Home
        </Link>

        <p className="text-gray-600 text-sm mt-8">
          Still hungry? Try our{" "}
          <Link to="/recipes" className="text-orange-500 hover:underline font-medium">
            featured recipes
          </Link>
        </p>
      </div>
    </div>
  );
}
