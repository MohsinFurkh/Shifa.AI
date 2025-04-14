export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-400 rounded-md text-white mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
} 