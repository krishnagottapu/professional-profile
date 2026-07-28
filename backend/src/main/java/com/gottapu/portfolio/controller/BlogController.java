package com.gottapu.portfolio.controller;

import com.gottapu.portfolio.dto.BlogPostDetailDto;
import com.gottapu.portfolio.dto.BlogPostDto;
import com.gottapu.portfolio.service.BlogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blog")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public ResponseEntity<Page<BlogPostDto>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<BlogPostDto> posts = blogService.getPublishedPosts(PageRequest.of(page, size));
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogPostDetailDto> getPost(@PathVariable String slug) {
        BlogPostDetailDto post = blogService.getPostBySlug(slug);
        return ResponseEntity.ok(post);
    }
}
