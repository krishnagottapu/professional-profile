package com.gottapu.portfolio.controller;

import com.gottapu.portfolio.dto.SkillsByCategoryDto;
import com.gottapu.portfolio.service.SkillService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<List<SkillsByCategoryDto>> getSkills() {
        return ResponseEntity.ok(skillService.getSkillsGroupedByCategory());
    }
}
