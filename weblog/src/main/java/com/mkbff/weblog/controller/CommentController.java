package com.mkbff.weblog.controller;

import com.mkbff.weblog.entities.Comment;
import com.mkbff.weblog.services.CommentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPost(@PathVariable Integer postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Comment createComment(@RequestBody Comment comment) {
        return commentService.createComment(comment);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public void deleteComment(@PathVariable Integer id) {
        commentService.deleteComment(id);
    }
}