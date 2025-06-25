export default function Loading() {
  return (
    <div className="w-full min-h-64 flex flex-col items-center justify-center py-32">
      <div className="text-xl font-bold text-primary mb-3 animate-pulse">Loading items...</div>
      <div className="text-foreground/50 mb-6">Please wait while we load your items.</div>
      <div className="w-10 h-10 rounded-full border-4 border-primary border-opacity-30 border-t-primary animate-spin"></div>
    </div>
  );
}
