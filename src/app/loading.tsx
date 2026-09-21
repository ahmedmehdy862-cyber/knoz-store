export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-background)]">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-[var(--brand-secondary)] border-t-[var(--brand-primary)] rounded-full animate-spin mx-auto" />
        </div>

        <p className="text-lg text-[var(--brand-text-secondary)] font-medium font-[family-name:var(--font-heading)]">
          جاري التحميل...
        </p>
      </div>
    </div>
  );
}
