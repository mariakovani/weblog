package com.mkbff.weblog.services;

import com.mkbff.weblog.entities.Comment;
import com.mkbff.weblog.entities.User;
import com.mkbff.weblog.repository.CommentRepository;
import com.mkbff.weblog.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    public List<Comment> getCommentsByPostId(Integer postId) {
        return commentRepository.findByPostId(postId);
    }

    public Comment createComment(Comment comment) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
            .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        comment.setAuthor(currentUser);
        return commentRepository.save(comment);
    }

    public void deleteComment(Integer id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        boolean isOwner = comment.getAuthor().getUsername().equals(currentUsername);
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You don't have permission to delete this comment");
        }

        commentRepository.deleteById(id);
    }
}