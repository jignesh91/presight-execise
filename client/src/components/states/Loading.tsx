export function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-600" />
      <p className="text-sm text-gray-400">Loading users...</p>
    </div>
  );
}
