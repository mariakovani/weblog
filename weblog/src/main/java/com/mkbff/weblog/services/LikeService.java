package com.mkbff.weblog.services;

import com.mkbff.weblog.entities.Like;
import com.mkbff.weblog.repository.LikeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeService {

    private final LikeRepository likeRepository;

    public LikeService(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    public List<Like> getLikesByPostId(Integer postId) {
        return likeRepository.findByPostId(postId);
    }

    public long countLikesByPostId(Integer postId) {
        return likeRepository.countByPostId(postId);
    }

    public Like likePost(Like like) {
        return likeRepository.save(like);
    }

    public void unlikePost(Integer id) {
        likeRepository.deleteById(id);
    }
}