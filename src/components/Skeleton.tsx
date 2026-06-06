export function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-14" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
          </div>
          <div className="flex gap-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          </div>
          <div className="flex justify-between pt-2">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-28" />
            <div className="flex gap-1">
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-14" />
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
