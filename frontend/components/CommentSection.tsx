"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCommentsByPost, createComment, deleteComment } from "@/lib/api";
import { Comment } from "@/types";

export default function CommentSection({ postId }: { postId: number }) {
  const { token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadComments();
  }, [postId]);

  async function loadComments() {
    try {
      const data = await getCommentsByPost(postId);
      setComments(data);
    } catch (err) {
      setError("Failed to load comments");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in to comment.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      await createComment(newComment, postId, token);
      setNewComment("");
      await loadComments();
    } catch (err) {
      setError("Failed to post comment.");
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    try {
      await deleteComment(id, token);
      await loadComments();
    } catch (err) {
      setError("You don't have permission to delete this comment.");
    }
  }

  function getCurrentUsername(): string | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch {
      return null;
    }
  }

  const currentUsername = getCurrentUsername();

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>

      {token && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border p-2 rounded"
            rows={3}
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-1 rounded text-sm"
          >
            Post Comment
          </button>
        </form>
      )}

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">
                  {comment.author?.username}
                </p>
                <p className="text-sm">{comment.content}</p>
              </div>

              {currentUsername === comment.author?.username && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}