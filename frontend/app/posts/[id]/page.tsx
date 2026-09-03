import { getPostById } from "@/lib/api";
import { getDisplayDate } from "@/lib/utils";
import { Post } from "@/types";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";
import EditPostLink from "@/components/EditPostLink";
import Link from "next/link";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post: Post = await getPostById(Number(id));

  return (
    <main className="max-w-3xl mx-auto p-8">
      <span className="badge">
        {post.category?.name}
      </span>

      <h1 className="font-didot font-bold text-4xl mt-4 mb-2 break-words">
        {post.title}
      </h1>

      <p className="text-sm text-gray-500 mb-4">
        by{" "}
        <Link href={`/profile/${post.author?.id}`} className="hover:underline">
          {post.author?.username}
        </Link>{" "}
        · {getDisplayDate(post.createdAt, post.updatedAt)}
      </p>

      <p className="mb-6 whitespace-pre-wrap leading-relaxed break-words">
        {post.content}
      </p>

      <EditPostLink
        postId={post.id}
        authorId={post.author?.id}
      />

      <div className="mt-4">
        <LikeButton postId={post.id} />
      </div>

      <CommentSection postId={post.id} />
    </main>
  );
}