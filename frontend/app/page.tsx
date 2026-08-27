import Link from "next/link";
import { getPosts } from "@/lib/api";
import { getDisplayDate } from "@/lib/utils";
import { Post } from "@/types";

export default async function Home() {
  const posts: Post[] = await getPosts();

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="font-didot font-bold text-4xl mb-8">Weblog</h1>

      {posts.length === 0 && (
        <p style={{ color: "var(--text-muted)" }}>
          Nothing published yet. Be the first to write something.
        </p>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <article className="card mb-6">
              <span className="badge">{post.category?.name}</span>

              <h2 className="font-didot text-2xl mt-3 mb-1">
                {post.title}
              </h2>

              <p className="text-sm text-gray-500 mb-4">
                by {post.author?.username} ·{" "}
                {getDisplayDate(post.createdAt, post.updatedAt)}
              </p>

              <p
                className="mt-3 text-sm">
                {post.content.slice(0, 140)}
                {post.content.length > 140 ? "…" : ""}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}