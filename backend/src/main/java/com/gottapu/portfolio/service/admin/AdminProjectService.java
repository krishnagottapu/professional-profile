package com.gottapu.portfolio.service.admin;

import com.gottapu.portfolio.dto.admin.CreateProjectRequest;
import com.gottapu.portfolio.dto.admin.ReorderRequest;
import com.gottapu.portfolio.dto.admin.UpdateProjectRequest;
import com.gottapu.portfolio.entity.Project;
import com.gottapu.portfolio.repository.ProjectRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminProjectService {

    private final ProjectRepository projectRepository;

    public AdminProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderBySortOrderAsc();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    @Transactional
    public Project createProject(CreateProjectRequest request) {
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setTechTags(request.getTechTags() != null ? String.join(",", request.getTechTags()) : null);
        project.setGithubUrl(request.getGithubUrl());
        project.setDemoUrl(request.getDemoUrl());
        project.setFeatured(request.isFeatured());
        project.setSortOrder(request.getSortOrder());
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(Long id, UpdateProjectRequest request) {
        Project project = getProjectById(id);

        if (request.getTitle() != null) {
            project.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getTechTags() != null) {
            project.setTechTags(String.join(",", request.getTechTags()));
        }
        if (request.getGithubUrl() != null) {
            project.setGithubUrl(request.getGithubUrl());
        }
        if (request.getDemoUrl() != null) {
            project.setDemoUrl(request.getDemoUrl());
        }
        if (request.getFeatured() != null) {
            project.setFeatured(request.getFeatured());
        }
        if (request.getSortOrder() != null) {
            project.setSortOrder(request.getSortOrder());
        }

        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }

    @Transactional
    public void reorderProjects(List<ReorderRequest> reorderRequests) {
        for (ReorderRequest request : reorderRequests) {
            Project project = getProjectById(request.id());
            project.setSortOrder(request.sortOrder());
            projectRepository.save(project);
        }
    }
}
