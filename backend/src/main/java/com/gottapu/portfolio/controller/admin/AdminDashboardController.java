package com.gottapu.portfolio.controller.admin;

import com.gottapu.portfolio.dto.admin.DashboardStatsDto;
import com.gottapu.portfolio.repository.BlogPostRepository;
import com.gottapu.portfolio.repository.ContactMessageRepository;
import com.gottapu.portfolio.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final BlogPostRepository blogPostRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final ProjectRepository projectRepository;

    public AdminDashboardController(BlogPostRepository blogPostRepository,
                                    ContactMessageRepository contactMessageRepository,
                                    ProjectRepository projectRepository) {
        this.blogPostRepository = blogPostRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.projectRepository = projectRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        long totalPosts = blogPostRepository.count();
        long unreadMessages = contactMessageRepository.countByReadFalse();
        long totalProjects = projectRepository.count();
        return ResponseEntity.ok(new DashboardStatsDto(totalPosts, unreadMessages, totalProjects));
    }
}
