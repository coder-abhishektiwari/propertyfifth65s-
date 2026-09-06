import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} | Property Fifth`,
    description: `Explore ${name} - premium real estate opportunity with Property Fifth.`,
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <section className="section-py bg-[var(--bg)]">
      <div className="container-site">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--gold)] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/properties" className="hover:text-[var(--gold)] transition-colors">
            Properties
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--text)]">{name}</span>
        </nav>

        <div className="text-center py-20">
          <h1 className="heading-lg mb-4">{name}</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Property detail page coming soon.
          </p>
          <Link href="/properties" className="btn-primary">
            Back to Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
