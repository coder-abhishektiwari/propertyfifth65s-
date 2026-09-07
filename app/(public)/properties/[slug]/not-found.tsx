import Link from "next/link";

export default function PropertyNotFound() {
  return (
    <section className="section-py bg-[var(--bg)]">
      <div className="container-site text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-muted)] flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--text-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h1 className="heading-md mb-2">Property Not Found</h1>
        <p className="text-sm text-[var(--text-muted)] mb-6 max-w-md mx-auto">
          The property you&apos;re looking for doesn&apos;t exist or is no longer available.
        </p>
        <Link href="/properties" className="btn-primary">
          Browse Properties
        </Link>
      </div>
    </section>
  );
}
