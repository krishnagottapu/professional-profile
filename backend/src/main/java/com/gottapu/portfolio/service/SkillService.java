package com.gottapu.portfolio.service;

import com.gottapu.portfolio.dto.SkillDto;
import com.gottapu.portfolio.dto.SkillsByCategoryDto;
import com.gottapu.portfolio.entity.Skill;
import com.gottapu.portfolio.repository.SkillRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<SkillsByCategoryDto> getSkillsGroupedByCategory() {
        List<Skill> allSkills = skillRepository.findAllByOrderByCategoryAscSortOrderAsc();

        return allSkills.stream()
                .collect(Collectors.groupingBy(Skill::getCategory))
                .entrySet().stream()
                .map(entry -> new SkillsByCategoryDto(
                        entry.getKey(),
                        entry.getValue().stream()
                                .map(this::toDto)
                                .toList()
                ))
                .toList();
    }

    private SkillDto toDto(Skill skill) {
        return new SkillDto(
                skill.getId(),
                skill.getName(),
                skill.getCategory(),
                skill.getProficiency(),
                skill.getSortOrder()
        );
    }
}
