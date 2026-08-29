import Link from "next/link";
import { getUserById, getPostsByUser, getProfileByUserId } from "@/lib/api";
import { getDisplayDate } from "@/lib/utils";
import { User, Post } from "@/types";
import EditProfileLink from "@/components/EditProfileLink";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);

  const user: User = await getUserById(userId);
  const posts: Post[] = await getPostsByUser(userId);
  const profile = await getProfileByUserId(userId);

  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="mb-10 flex gap-5 items-start">
        {profile?.avatarUrl && (
          <img
            src={profile.avatarUrl}
            alt={user.username}
            className="w-20 h-20 rounded-full object-cover"
            style={{ border: "1px solid var(--border)" }}
          />
        )}

        <div>
          <h1 className="font-didot font-bold text-3xl mb-1">{user.username}</h1>
          {user.role === "ADMIN" && (
            <span className="badge mb-2 inline-block">Admin</span>
          )}

        {profile?.location && (
        <p
            className="text-sm mt-2"
            style={{
            //color: "#020202",
            letterSpacing: "0.02em",
            fontStyle: "normal", 
            }}
        >
            <span style={{ color: "#020202" }}>಄ based in</span>{" "}
            <span style={{ color: "#3f3f3f" }}>{profile.location}</span>
        </p>
        )}

        {profile?.bio && (
        <p className="font-didot text-base mt-1 max-w-md">{profile.bio}</p>
        )}

          <EditProfileLink userId={userId} authorUsername={user.username} />
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">
        {posts.length === 0 ? "No posts yet" : `Posts (${posts.length})`}
      </h2>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <article className="card">
              <span className="badge">{post.category?.name}</span>
              <h3 className="font-didot text-2xl mt-3 mb-1">{post.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{getDisplayDate(post.createdAt, post.updatedAt)}</p>
              <p
                className="mt-3 text-sm">
                {post.content.slice(0, 200)}
                {post.content.length > 200 ? "…" : ""}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}