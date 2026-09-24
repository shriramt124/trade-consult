import type { Metadata } from "next";
import Link from "next/link";
import { apiServer } from "@/lib/api";
import { FALLBACK_POSTS } from "@/lib/data";
import type { BlogPost } from "@/lib/types";

export const metadata: Metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await apiServer<BlogPost[]>("/blog", FALLBACK_POSTS);

  return (
    <>
      <section className="bg-navy-950 py-20">
        <div className="container-site">
          <p className="eyebrow">News &amp; Insights</p>
          <h1 className="mt-2 text-4xl font-extrabold text-white sm:text-5xl">Our Blog</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Market insights, trading psychology and research explainers from our desk.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container-site grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card group flex flex-col transition-shadow hover:shadow-lg">
              <div className="flex h-36 items-center justify-center rounded-xl bg-navy-900 text-4xl">
                📊
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                {p.published_at
                  ? new Date(p.published_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric",
                    })
                  : "Draft"}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-navy-900 group-hover:text-brand-600">
                {p.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{p.excerpt}</p>
              <span className="mt-4 text-sm font-semibold text-brand-600">Read more →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
