package com.gottapu.portfolio.dto;

import java.util.List;

public record SkillsByCategoryDto(
        String category,
        List<SkillDto> skills
) {}
