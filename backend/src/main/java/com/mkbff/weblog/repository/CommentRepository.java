package com.mkbff.weblog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mkbff.weblog.entities.Comment;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByPostId(Integer postId);
    void deleteByPostId(Integer postId);
}
