package com.mkbff.weblog.controller;

import com.mkbff.weblog.entities.Post;
import com.mkbff.weblog.services.PostService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public Post getPostById(@PathVariable Integer id) {
        return postService.getPostById(id);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Post createPost(@RequestBody Post post) {
        return postService.createPost(post);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public void deletePost(@PathVariable Integer id) {
        postService.deletePost(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Post updatePost(@PathVariable Integer id, @RequestBody Post post) {
        return postService.updatePost(id, post);
    }
}