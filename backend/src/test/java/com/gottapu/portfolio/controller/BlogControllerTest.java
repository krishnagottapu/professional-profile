package com.gottapu.portfolio.controller;

import com.gottapu.portfolio.config.SecurityConfig;
import com.gottapu.portfolio.dto.BlogPostDetailDto;
import com.gottapu.portfolio.dto.BlogPostDto;
import com.gottapu.portfolio.exception.ResourceNotFoundException;
import com.gottapu.portfolio.service.BlogService;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BlogController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
    "spring.security.user.name=admin",
    "spring.security.user.password=admin123"
})
class BlogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BlogService blogService;

    @Test
    void getPosts_returnsPagedResults() throws Exception {
        BlogPostDto dto = new BlogPostDto(
                1L, "Test Post", "test-post", "An excerpt",
                true, LocalDateTime.of(2026, 1, 15, 10, 0), 5
        );
        Page<BlogPostDto> page = new PageImpl<>(
                List.of(dto), PageRequest.of(0, 10), 1
        );
        when(blogService.getPublishedPosts(any())).thenReturn(page);

        mockMvc.perform(get("/api/blog").param("page", "0").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].title").value("Test Post"))
                .andExpect(jsonPath("$.content[0].slug").value("test-post"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void getPost_returnsDetailWhenFound() throws Exception {
        BlogPostDetailDto detail = new BlogPostDetailDto(
                1L, "Test Post", "test-post", "<p>Content</p>", "An excerpt",
                true, LocalDateTime.of(2026, 1, 15, 10, 0),
                LocalDateTime.of(2026, 1, 16, 12, 0), 5
        );
        when(blogService.getPostBySlug("test-post")).thenReturn(detail);

        mockMvc.perform(get("/api/blog/test-post"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Post"))
                .andExpect(jsonPath("$.content").value("<p>Content</p>"));
    }

    @Test
    void getPost_returns404WhenNotFound() throws Exception {
        when(blogService.getPostBySlug("nonexistent"))
                .thenThrow(new ResourceNotFoundException("Blog post", "nonexistent"));

        mockMvc.perform(get("/api/blog/nonexistent"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"));
    }
}
