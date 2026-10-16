package com.mkbff.weblog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mkbff.weblog.entities.Like;
import java.util.List;

public interface LikeRepository extends JpaRepository<Like, Integer> {
    List<Like> findByPostId(Integer postId);

    long countByPostId(Integer postId);
    void deleteByPostId(Integer postId);
}
