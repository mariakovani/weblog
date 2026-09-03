"use client";

import { useState } from "react";
import Link from "next/link";
import { searchUsers, getProfileByUserId } from "@/lib/api";
import { useAuth, getUserIdFromToken } from "@/context/AuthContext";
import { User, Profile } from "@/types";

type UserWithProfile = User & { profile: Profile | null };

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserWithProfile[]>([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const { token } = useAuth();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("You must be logged in to search.");
      return;
    }
    if (!query.trim()) return;

    try {
      const data: User[] = await searchUsers(query, token);
      const currentUserId = getUserIdFromToken(token);

      const filtered = data.filter((user) => user.id !== currentUserId);

      const withProfiles: UserWithProfile[] = await Promise.all(
        filtered.map(async (user) => {
          const profile = await getProfileByUserId(user.id);
          return { ...user, profile };
        })
      );

      setResults(withProfiles);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed.");
    }
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="font-didot font-bold text-4xl mb-6">Find People</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username..."
          className="input"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {searched && results.length === 0 && !error && (
        <p className="text-sm text-gray-500">No users found.</p>
      )}

      <div className="space-y-3">
        {results.map((user) => (
          <Link href={`/profile/${user.id}`} key={user.id}>
            <div className="card mb-4 flex items-center gap-4">
              {user.profile?.avatarUrl ? (
                <img
                  src={user.profile.avatarUrl}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                  style={{ border: "1px solid var(--border)" }}
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ background: "var(--paper)", border: "1px solid var(--border)" }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1 flex items-center justify-between">
                <p className="font-didot font-bold text-base">{user.username}</p>
                {user.role === "ADMIN" && <span className="badge">Admin</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}