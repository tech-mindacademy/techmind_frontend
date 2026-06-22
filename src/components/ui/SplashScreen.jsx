export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <img
          src="/logo.png"
          alt="Loading"
          className="w-20 h-20 object-contain animate-bounce"
        />
        <div className="mt-3 w-12 h-2 rounded-full bg-indigo-400/30 dark:bg-indigo-500/20 animate-pulse" />
      </div>
      <p className="mt-8 text-xs tracking-widest uppercase text-gray-400 dark:text-white/30 font-medium">
        Loading...
      </p>
    </div>
  );
}