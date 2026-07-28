package com.mkbff.weblog.controller;

import com.mkbff.weblog.entities.Like;
import com.mkbff.weblog.services.LikeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @GetMapping("/post/{postId}")
    public List<Like> getLikesByPost(@PathVariable Integer postId) {
        return likeService.getLikesByPostId(postId);
    }

    @GetMapping("/post/{postId}/count")
    public long countLikes(@PathVariable Integer postId) {
        return likeService.countLikesByPostId(postId);
    }

    @PostMapping
    public Like likePost(@RequestBody Like like) {
        return likeService.likePost(like);
    }

    @DeleteMapping("/{id}")
    public void unlikePost(@PathVariable Integer id) {
        likeService.unlikePost(id);
    }
}