import { getPosts } from "@/lib/api";
import { Post } from "@/types";
import Link from "next/link";
import { getDisplayDate } from "@/lib/utils";

export default async function Home() {
  const posts: Post[] = await getPosts();

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Weblog</h1>

      {posts.length === 0 && (
        <p className="text-gray-500">No posts yet.</p>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="border-b pb-4">
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-xl font-semibold hover:underline">{post.title}</h2>
            </Link>
            <p className="text-sm text-gray-500">
              by {post.author?.username} in {post.category?.name} •{" "}
              {getDisplayDate(post.createdAt, post.updatedAt)}
            </p>
            <p className="mt-2">{post.content}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
