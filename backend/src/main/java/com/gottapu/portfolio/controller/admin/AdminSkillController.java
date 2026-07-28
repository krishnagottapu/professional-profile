package com.gottapu.portfolio.controller.admin;

import com.gottapu.portfolio.dto.admin.CreateSkillRequest;
import com.gottapu.portfolio.dto.admin.UpdateSkillRequest;
import com.gottapu.portfolio.entity.Skill;
import com.gottapu.portfolio.service.admin.AdminSkillService;
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
@RequestMapping("/api/admin/skills")
public class AdminSkillController {

    private final AdminSkillService adminSkillService;

    public AdminSkillController(AdminSkillService adminSkillService) {
        this.adminSkillService = adminSkillService;
    }

    @GetMapping
    public List<Skill> getAllSkills() {
        return adminSkillService.getAllSkills();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Skill createSkill(@Valid @RequestBody CreateSkillRequest request) {
        return adminSkillService.createSkill(request);
    }

    @GetMapping("/{id}")
    public Skill getSkillById(@PathVariable Long id) {
        return adminSkillService.getSkillById(id);
    }

    @PutMapping("/{id}")
    public Skill updateSkill(@PathVariable Long id, @Valid @RequestBody UpdateSkillRequest request) {
        return adminSkillService.updateSkill(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        adminSkillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
}
