package com.mkbff.weblog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mkbff.weblog.entities.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    
}
