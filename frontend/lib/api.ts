const API_BASE_URL = "http://localhost:8080/api";

export async function getPosts() {
  const res = await fetch(`${API_BASE_URL}/posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}
