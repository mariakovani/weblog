package com.mkbff.weblog.services;

import com.mkbff.weblog.entities.Post;
import com.mkbff.weblog.entities.User;
import com.mkbff.weblog.repository.PostRepository;
import com.mkbff.weblog.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Integer id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }

    public Post createPost(Post post) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        post.setAuthor(currentUser);
        return postRepository.save(post);
    }

    public void deletePost(Integer id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        boolean isOwner = post.getAuthor().getUsername().equals(currentUsername);
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You can only delete your own posts");
        }

        postRepository.deleteById(id);
    }

    public Post updatePost(Integer id, Post updatedPost) {
        Post existing = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isOwner = existing.getAuthor().getUsername().equals(currentUsername);
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You can only edit your own posts");
        }

        existing.setTitle(updatedPost.getTitle());
        existing.setContent(updatedPost.getContent());
        existing.setCategory(updatedPost.getCategory());

        return postRepository.save(existing);
    }

    public List<Post> getPostsByAuthorId(Integer authorId) {
        return postRepository.findByAuthorId(authorId);
    }
}
