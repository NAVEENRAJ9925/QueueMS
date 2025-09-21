function LoadingSpinner({ size = 'medium' }) {
  const sizeClass = 
    size === 'small' ? 'h-6 w-6 border-2' : 
    size === 'large' ? 'h-16 w-16 border-4' : 
    'h-10 w-10 border-2';

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full ${sizeClass} border-t-blue-500 border-blue-200`}></div>
    </div>
  );
}

export default LoadingSpinner;