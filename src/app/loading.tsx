export default function Loading() {
  return (
    <div className="flex items-center justify-center py-24" role="status" aria-label="جاري التحميل">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-accent flex items-center justify-center text-white font-bold text-xl font-heading animate-pulse">
          K
        </div>
        <div className="w-8 h-8 border-3 border-brand-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-brand-text-secondary">جاري التحميل...</p>
      </div>
    </div>
  );
}