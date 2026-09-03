const API_BASE_URL = "http://localhost:8080/api";

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return data.message || fallback;
  } catch {
    return fallback;
  }
}

export async function getPosts() {
  const res = await fetch(`${API_BASE_URL}/posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to fetch posts"));
  }

  return res.json();
}

export async function loginUser(username: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Invalid username or password"));
  }

  return res.json();
}

export async function registerUser(
  username: string,
  password: string,
  email: string,
) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Registration failed"));
  }

  return res.json();
}

export async function getPostById(id: number) {
  const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to fetch post"));
  }

  return res.json();
}

export async function getCommentsByPost(postId: number) {
  const res = await fetch(`${API_BASE_URL}/comments/post/${postId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to fetch comments"));
  }

  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to fetch categories"));
  }

  return res.json();
}

export async function createPost(
  title: string,
  content: string,
  categoryId: number,
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      content,
      category: { id: categoryId },
    }),
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to create post"));
  }

  return res.json();
}

export async function createComment(
  content: string,
  postId: number,
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content,
      post: { id: postId },
    }),
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to create comment"));
  }

  return res.json();
}

export async function deleteComment(id: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to delete comment"));
  }
}

export async function getLikeCount(postId: number) {
  const res = await fetch(`${API_BASE_URL}/likes/post/${postId}/count`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to fetch like count"));
  }

  return res.json();
}

export async function getLikesByPost(postId: number) {
  const res = await fetch(`${API_BASE_URL}/likes/post/${postId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to fetch likes"));
  }

  return res.json();
}

export async function likePost(postId: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      post: { id: postId },
    }),
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to like post"));
  }

  return res.json();
}


export async function unlikePost(likeId: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/likes/${likeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to unlike post"));
  }
}

export async function updatePost(
  id: number,
  title: string,
  content: string,
  categoryId: number,
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      content,
      category: { id: categoryId },
    }),
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to update post"));
  }

  return res.json();
}

export async function updateComment(
  id: number,
  content: string,
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to update comment"));
  }

  return res.json();
}

export async function getUserById(id: number) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to fetch user"));
  }

  return res.json();
}

export async function getPostsByUser(userId: number) {
  const res = await fetch(`${API_BASE_URL}/posts/user/${userId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to fetch user's posts"));
  }

  return res.json();
}

export async function getProfileByUserId(userId: number) {
  const res = await fetch(`${API_BASE_URL}/profiles/user/${userId}`, {
    cache: "no-store",
  });

  if (res.status === 404 || !res.ok) {
    return null;
  }

  return res.json();
}

export async function createProfile(
  bio: string,
  avatarUrl: string,
  location: string,
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bio, avatarUrl, location }),
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to create profile"));
  }

  return res.json();
}

export async function updateProfile(
  id: number,
  bio: string,
  avatarUrl: string,
  location: string,
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/profiles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bio, avatarUrl, location }),
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to update profile"));
  }

  return res.json();
}

export async function searchUsers(username: string, token: string) {
  const res = await fetch(
    `${API_BASE_URL}/users/search?username=${encodeURIComponent(username)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Search failed"));
  }

  return res.json();
}

export async function deletePost(id: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to delete post"));
  }
}