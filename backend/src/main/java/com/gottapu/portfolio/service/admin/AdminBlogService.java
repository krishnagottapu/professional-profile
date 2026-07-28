package com.gottapu.portfolio.service.admin;

import com.gottapu.portfolio.dto.admin.CreateBlogPostRequest;
import com.gottapu.portfolio.dto.admin.UpdateBlogPostRequest;
import com.gottapu.portfolio.entity.BlogPost;
import com.gottapu.portfolio.repository.BlogPostRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminBlogService {

    private final BlogPostRepository blogPostRepository;

    public AdminBlogService(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    public BlogPost getPostById(Long id) {
        return blogPostRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
    }

    @Transactional
    public BlogPost createPost(CreateBlogPostRequest request) {
        BlogPost post = new BlogPost();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setPublished(request.isPublished());

        String slug = request.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = slugify(request.getTitle());
        }
        slug = ensureUniqueSlug(slug, null);
        post.setSlug(slug);

        return blogPostRepository.save(post);
    }

    @Transactional
    public BlogPost updatePost(Long id, UpdateBlogPostRequest request) {
        BlogPost post = getPostById(id);

        if (request.getTitle() != null) {
            post.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            post.setContent(request.getContent());
        }
        if (request.getExcerpt() != null) {
            post.setExcerpt(request.getExcerpt());
        }
        if (request.getPublished() != null) {
            post.setPublished(request.getPublished());
        }
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            String slug = ensureUniqueSlug(request.getSlug(), id);
            post.setSlug(slug);
        }

        return blogPostRepository.save(post);
    }

    @Transactional
    public void deletePost(Long id) {
        BlogPost post = getPostById(id);
        blogPostRepository.delete(post);
    }

    private String slugify(String title) {
        return title.toLowerCase()
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-|-$", "");
    }

    private String ensureUniqueSlug(String slug, Long excludeId) {
        String candidate = slug;
        int counter = 2;
        while (true) {
            var existing = blogPostRepository.findBySlug(candidate);
            if (existing.isEmpty() || (excludeId != null && existing.get().getId().equals(excludeId))) {
                return candidate;
            }
            candidate = slug + "-" + counter;
            counter++;
        }
    }
}
