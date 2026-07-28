package com.gottapu.portfolio.service.admin;

import com.gottapu.portfolio.dto.admin.CreateSkillRequest;
import com.gottapu.portfolio.dto.admin.UpdateSkillRequest;
import com.gottapu.portfolio.entity.Skill;
import com.gottapu.portfolio.repository.SkillRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminSkillService {

    private final SkillRepository skillRepository;

    public AdminSkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAllByOrderByCategoryAscSortOrderAsc();
    }

    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Skill not found with id: " + id));
    }

    @Transactional
    public Skill createSkill(CreateSkillRequest request) {
        Skill skill = new Skill();
        skill.setName(request.getName());
        skill.setCategory(request.getCategory());
        skill.setProficiency(request.getProficiency());
        skill.setSortOrder(request.getSortOrder());
        return skillRepository.save(skill);
    }

    @Transactional
    public Skill updateSkill(Long id, UpdateSkillRequest request) {
        Skill skill = getSkillById(id);

        if (request.getName() != null) {
            skill.setName(request.getName());
        }
        if (request.getCategory() != null) {
            skill.setCategory(request.getCategory());
        }
        if (request.getProficiency() != null) {
            skill.setProficiency(request.getProficiency());
        }
        if (request.getSortOrder() != null) {
            skill.setSortOrder(request.getSortOrder());
        }

        return skillRepository.save(skill);
    }

    @Transactional
    public void deleteSkill(Long id) {
        Skill skill = getSkillById(id);
        skillRepository.delete(skill);
    }
}
