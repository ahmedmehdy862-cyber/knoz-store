import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-background)] px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="text-8xl" role="img" aria-label="lost">
            🔍
          </span>
        </div>

        <h1 className="text-4xl font-bold text-[var(--brand-primary)] mb-4 font-[family-name:var(--font-heading)]">
          مش لاقين الصفحة دي
        </h1>

        <p className="text-lg text-[var(--brand-text-secondary)] mb-8 leading-relaxed">
          الصفحة اللي بتدور عليها مش موجودة أو ربما اتنقلت.
          <br />
          جرّب ترجع الصفحة الرئيسية أو تتصفح المنتجات.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[var(--brand-primary)] text-white font-semibold text-lg hover:bg-[var(--brand-primary-dark)] transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            الرجوع للرئيسية
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] font-semibold text-lg hover:bg-[var(--brand-primary)] hover:text-white transition-colors duration-200"
          >
            تصفّح المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
