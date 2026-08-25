package com.mkbff.weblog.services;

import com.mkbff.weblog.entities.Like;
import com.mkbff.weblog.entities.User;
import com.mkbff.weblog.repository.LikeRepository;
import com.mkbff.weblog.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;

    public LikeService(LikeRepository likeRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
    }

    public List<Like> getLikesByPostId(Integer postId) {
        return likeRepository.findByPostId(postId);
    }

    public long countLikesByPostId(Integer postId) {
        return likeRepository.countByPostId(postId);
    }

    public Like likePost(Like like) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        like.setUser(currentUser);
        return likeRepository.save(like);
    }

    public void unlikePost(Integer id) {
        likeRepository.deleteById(id);
    }
}