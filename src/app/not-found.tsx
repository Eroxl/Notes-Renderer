const NotFound = () => (
  <div className="h-screen max-w-2xl w-full mx-auto flex flex-col justify-center gap-2 px-4 text-nord-4">
    <div className="text-6xl font-bold text-nord-3">404</div>
    <div className="text-2xl font-semibold">Page not found</div>
    <div className="text-nord-3 text-sm">
      This note doesn't exist or may have been moved.
    </div>
  </div>
);

export default NotFound;
