export default function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <img
          src="/logo.png"
          alt="Loading"
          className="w-14 h-14 object-contain animate-bounce"
        />
        <div className="mt-2 w-8 h-1.5 rounded-full bg-indigo-400/30 dark:bg-indigo-500/20 animate-pulse" />
      </div>
      <p className="mt-6 text-xs tracking-widest uppercase text-gray-400 dark:text-white/30 font-medium">
        Loading...
      </p>
    </div>
  );
}