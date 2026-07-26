package com.mkbff.weblog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mkbff.weblog.entities.Like;

public interface LikeRepository extends JpaRepository<Like, Long> {
    
}
