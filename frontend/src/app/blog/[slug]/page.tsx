import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiServer } from "@/lib/api";
import { FALLBACK_POSTS } from "@/lib/data";
import type { BlogPost } from "@/lib/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const fallback = FALLBACK_POSTS.find((p) => p.slug === slug) ?? null;
  return apiServer<BlogPost | null>(`/blog/${slug}`, fallback);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="bg-slate-50 py-16">
      <div className="container-site max-w-3xl">
        <Link href="/blog" className="text-sm font-semibold text-brand-600">
          ← Back to blog
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          By {post.author}
          {post.published_at &&
            ` · ${new Date(post.published_at).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
            })}`}
        </p>
        <div className="card mt-8">
          {(post.content ?? "").split("\n").filter(Boolean).map((para, i) => (
            <p key={i} className="mb-4 text-base leading-relaxed text-slate-700 last:mb-0">
              {para}
            </p>
          ))}
        </div>
        <p className="mt-8 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
          Disclaimer: This article is for educational purposes only and is not
          investment advice. Investment in securities market is subject to market
          risks.
        </p>
      </div>
    </article>
  );
}
