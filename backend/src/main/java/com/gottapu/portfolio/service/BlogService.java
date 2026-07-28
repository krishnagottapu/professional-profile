package com.gottapu.portfolio.service;

import com.gottapu.portfolio.dto.BlogPostDetailDto;
import com.gottapu.portfolio.dto.BlogPostDto;
import com.gottapu.portfolio.entity.BlogPost;
import com.gottapu.portfolio.exception.ResourceNotFoundException;
import com.gottapu.portfolio.repository.BlogPostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class BlogService {

    private final BlogPostRepository blogPostRepository;

    public BlogService(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    public Page<BlogPostDto> getPublishedPosts(Pageable pageable) {
        return blogPostRepository.findByPublishedTrueOrderByCreatedAtDesc(pageable)
                .map(this::toDto);
    }

    public BlogPostDetailDto getPostBySlug(String slug) {
        BlogPost post = blogPostRepository.findBySlug(slug)
                .filter(BlogPost::isPublished)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post", slug));
        return toDetailDto(post);
    }

    private BlogPostDto toDto(BlogPost post) {
        return new BlogPostDto(
                post.getId(),
                post.getTitle(),
                post.getSlug(),
                post.getExcerpt(),
                post.isPublished(),
                post.getCreatedAt(),
                post.getReadTimeMinutes()
        );
    }

    private BlogPostDetailDto toDetailDto(BlogPost post) {
        return new BlogPostDetailDto(
                post.getId(),
                post.getTitle(),
                post.getSlug(),
                post.getContent(),
                post.getExcerpt(),
                post.isPublished(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getReadTimeMinutes()
        );
    }
}
