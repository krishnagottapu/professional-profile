package com.gottapu.portfolio.dto;

import java.time.LocalDateTime;

public record BlogPostDetailDto(
        Long id,
        String title,
        String slug,
        String content,
        String excerpt,
        boolean published,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        int readTimeMinutes
) {}
