package com.mkbff.weblog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mkbff.weblog.entities.Post;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByAuthorIdOrderByCreatedAtDesc(Integer authorId);
    List<Post> findAllByOrderByCreatedAtDesc();
}