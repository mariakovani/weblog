import { getPostById } from "@/lib/api";
import { Post } from "@/types";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const post: Post = await getPostById(Number(params.id));

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        by {post.author?.username} in {post.category?.name}
      </p>

      <p className="mb-6 whitespace-pre-wrap">{post.content}</p>

      <LikeButton postId={post.id} />

      <CommentSection postId={post.id} />
    </main>
  );
}