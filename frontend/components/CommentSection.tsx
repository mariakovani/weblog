"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCommentsByPost, createComment, deleteComment, updateComment } from "@/lib/api";
import { Comment } from "@/types";
import { getDisplayDate } from "@/lib/utils";

export default function CommentSection({ postId }: { postId: number }) {
  const { token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

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

  function startEdit(comment: Comment) {
    setEditingId(comment.id);
    setEditContent(comment.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditContent("");
  }

  async function saveEdit(id: number) {
    if (!token) return;
    try {
      await updateComment(id, editContent, token);
      setEditingId(null);
      await loadComments();
    } catch (err) {
      setError("Failed to update comment.");
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

  function isEdited(comment: Comment): boolean {
    return !!comment.updatedAt && comment.updatedAt !== comment.createdAt;
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
            {editingId === comment.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border p-2 rounded"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(comment.id)}
                    className="text-xs bg-black text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-xs text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">
                    {comment.author?.username}
                  </p>
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-gray-400">
                    {getDisplayDate(comment.createdAt, comment.updatedAt)}
                  </p>
                </div>

                {currentUsername === comment.author?.username && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(comment)}
                      className="text-xs text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}