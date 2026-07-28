package com.gottapu.portfolio.controller.admin;

import com.gottapu.portfolio.dto.admin.CreateProjectRequest;
import com.gottapu.portfolio.dto.admin.ReorderRequest;
import com.gottapu.portfolio.dto.admin.UpdateProjectRequest;
import com.gottapu.portfolio.entity.Project;
import com.gottapu.portfolio.service.admin.AdminProjectService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final AdminProjectService adminProjectService;

    public AdminProjectController(AdminProjectService adminProjectService) {
        this.adminProjectService = adminProjectService;
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return adminProjectService.getAllProjects();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(@Valid @RequestBody CreateProjectRequest request) {
        return adminProjectService.createProject(request);
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return adminProjectService.getProjectById(id);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @Valid @RequestBody UpdateProjectRequest request) {
        return adminProjectService.updateProject(id, request);
    }

    @PatchMapping("/reorder")
    public ResponseEntity<Void> reorderProjects(@RequestBody List<ReorderRequest> reorderRequests) {
        adminProjectService.reorderProjects(reorderRequests);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        adminProjectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
