package com.gottapu.portfolio.dto;

import java.time.LocalDateTime;

public record BlogPostDto(
        Long id,
        String title,
        String slug,
        String excerpt,
        boolean published,
        LocalDateTime createdAt,
        int readTimeMinutes
) {}
