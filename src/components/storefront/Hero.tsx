import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-surface via-brand-secondary/30 to-brand-accent/10">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-accent/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-secondary/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-right">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-primary font-heading leading-tight">
              صمّم منتجك
              <br />
              <span className="text-brand-accent">بتفاصيلك</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-brand-text-secondary max-w-lg mx-auto lg:mx-0 lg:mr-0 leading-relaxed">
              مش مجرد منتج... خليه بيك.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-brand-primary text-white font-medium text-base shadow-md hover:bg-brand-primary-light hover:shadow-lg active:bg-brand-primary-dark transition-all duration-200"
              >
                تسوق الآن
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border-2 border-brand-primary text-brand-primary font-medium text-base bg-transparent hover:bg-brand-primary hover:text-white active:bg-brand-primary-dark transition-all duration-200"
              >
                اكتشف منتجاتنا
              </Link>
            </div>
          </div>

          {/* Decorative illustration */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-accent/20 to-brand-secondary/40 rotate-6 blur-sm" />
              <div className="relative flex items-center justify-center w-full h-full rounded-3xl bg-brand-surface border border-brand-border-light shadow-lg overflow-hidden">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-brand-accent">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </div>
                  <p className="text-brand-text-secondary font-heading text-lg">
                    منتجاتك uniquely تعبّر عنك
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
