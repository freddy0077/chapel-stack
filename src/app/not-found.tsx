import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-10 flex flex-col items-center max-w-lg w-full border border-gray-100 dark:border-gray-800">
        <div className="text-6xl font-extrabold text-blue-600 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link href="/dashboard">
          <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors duration-200">Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
