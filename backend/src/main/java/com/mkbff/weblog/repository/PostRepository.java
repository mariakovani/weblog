package com.mkbff.weblog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mkbff.weblog.entities.Post;

public interface PostRepository extends JpaRepository<Post, Integer> {
    
}