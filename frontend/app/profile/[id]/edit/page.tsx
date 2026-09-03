"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getProfileByUserId, createProfile, updateProfile } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const userId = Number(id);

  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [location, setLocation] = useState("");
  const [profileId, setProfileId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getProfileByUserId(userId).then((profile) => {
      if (profile) {
        setProfileId(profile.id);
        setBio(profile.bio ?? "");
        setAvatarUrl(profile.avatarUrl ?? "");
        setLocation(profile.location ?? "");
      }
    });
  }, [userId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) return;

    try {
      if (profileId) {
        await updateProfile(profileId, bio, avatarUrl, location, token);
      } else {
        await createProfile(bio, avatarUrl, location, token);
      }
      router.push(`/profile/${userId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="font-didot text-3xl mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm block mb-1" style={{ color: "var(--text-muted)" }}>
            Avatar URL
          </label>
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="input"
          />
        </div>

        <div>
          <label className="text-sm block mb-1" style={{ color: "var(--text-muted)" }}>
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Athens, Greece"
            className="input"
          />
        </div>

        <div>
          <label className="text-sm block mb-1" style={{ color: "var(--text-muted)" }}>
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input"
            rows={4}
          />
        </div>

        {error && <p className="text-sm" style={{ color: "var(--coral)" }}>{error}</p>}

        <button type="submit" className="btn btn-primary w-full justify-center">
          Save Profile
        </button>
      </form>
    </main>
  );
}