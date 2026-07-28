package com.gottapu.portfolio.dto;

import java.util.List;

public record ProjectDto(
        Long id,
        String title,
        String description,
        List<String> techTags,
        String githubUrl,
        String demoUrl,
        boolean featured,
        int sortOrder
) {}
