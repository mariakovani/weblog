import { getPostById } from "@/lib/api";
import { getDisplayDate } from "@/lib/utils";
import { Post } from "@/types";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";
import EditPostLink from "@/components/EditPostLink";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post: Post = await getPostById(Number(id));

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">
        {post.title}
      </h1>

      <p className="text-sm text-gray-500 mb-4">
        by {post.author?.username} in {post.category?.name} •{" "}
        {getDisplayDate(post.createdAt, post.updatedAt)}
      </p>

      <p className="mb-4 whitespace-pre-wrap">
        {post.content}
      </p>

      <EditPostLink
        postId={post.id}
        authorUsername={post.author?.username}
      />

      <LikeButton postId={post.id} />

      <CommentSection postId={post.id} />
    </main>
  );
}