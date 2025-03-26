import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Oops! This page doesn't exist.</h2>
      <p className="text-lg text-gray-600 mb-6">The page you are looking for might have been removed or is temporarily unavailable.</p>
      <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
        Go Home
      </Link>
    </div>
  );
}
