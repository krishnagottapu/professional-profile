package com.gottapu.portfolio.dto.admin;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CreateProjectRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private List<String> techTags;

    private String githubUrl;

    private String demoUrl;

    private boolean featured;

    private int sortOrder;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getTechTags() {
        return techTags;
    }

    public void setTechTags(List<String> techTags) {
        this.techTags = techTags;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getDemoUrl() {
        return demoUrl;
    }

    public void setDemoUrl(String demoUrl) {
        this.demoUrl = demoUrl;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }
}
