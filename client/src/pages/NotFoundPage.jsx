import { Link } from "react-router-dom";
import { FaLeaf, FaHome } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4">
      <div className="glass p-12 rounded-3xl shadow-2xl text-center max-w-md mx-auto">
        <FaLeaf className="text-green-600 text-8xl mx-auto mb-6 animate-bounce drop-shadow-lg" />
        <h1 className="text-5xl font-extrabold mb-4 text-green-800">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          Page Not Found
        </h2>
        <p className="text-green-600 mb-8 text-lg">
          Oops! The page you're looking for seems to have been harvested already.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-3 bg-green-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-green-600 shadow-lg transition-all transform hover:-translate-y-1"
        >
          <FaHome className="text-lg" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
