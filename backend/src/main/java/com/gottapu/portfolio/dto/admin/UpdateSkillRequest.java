package com.gottapu.portfolio.dto.admin;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class UpdateSkillRequest {

    private String name;

    private String category;

    @Min(value = 0, message = "Proficiency must be at least 0")
    @Max(value = 100, message = "Proficiency must not exceed 100")
    private Integer proficiency;

    private Integer sortOrder;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getProficiency() {
        return proficiency;
    }

    public void setProficiency(Integer proficiency) {
        this.proficiency = proficiency;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}
