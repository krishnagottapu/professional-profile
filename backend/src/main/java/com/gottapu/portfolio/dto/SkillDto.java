package com.gottapu.portfolio.dto;

public record SkillDto(
        Long id,
        String name,
        String category,
        int proficiency,
        int sortOrder
) {}
