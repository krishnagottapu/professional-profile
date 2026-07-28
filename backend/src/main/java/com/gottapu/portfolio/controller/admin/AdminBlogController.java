package com.gottapu.portfolio.controller.admin;

import com.gottapu.portfolio.dto.admin.CreateBlogPostRequest;
import com.gottapu.portfolio.dto.admin.UpdateBlogPostRequest;
import com.gottapu.portfolio.entity.BlogPost;
import com.gottapu.portfolio.service.admin.AdminBlogService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/blog")
public class AdminBlogController {

    private final AdminBlogService adminBlogService;

    public AdminBlogController(AdminBlogService adminBlogService) {
        this.adminBlogService = adminBlogService;
    }

    @GetMapping
    public List<BlogPost> getAllPosts() {
        return adminBlogService.getAllPosts();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BlogPost createPost(@Valid @RequestBody CreateBlogPostRequest request) {
        return adminBlogService.createPost(request);
    }

    @GetMapping("/{id}")
    public BlogPost getPostById(@PathVariable Long id) {
        return adminBlogService.getPostById(id);
    }

    @PutMapping("/{id}")
    public BlogPost updatePost(@PathVariable Long id, @Valid @RequestBody UpdateBlogPostRequest request) {
        return adminBlogService.updatePost(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        adminBlogService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
