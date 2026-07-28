package com.gottapu.portfolio.controller;

import com.gottapu.portfolio.config.SecurityConfig;
import com.gottapu.portfolio.dto.SkillDto;
import com.gottapu.portfolio.dto.SkillsByCategoryDto;
import com.gottapu.portfolio.service.SkillService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SkillController.class)
@Import(SecurityConfig.class)
class SkillControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SkillService skillService;

    @Test
    void getSkills_returnsGroupedByCategory() throws Exception {
        SkillDto java = new SkillDto(1L, "Java", "Backend", 90, 1);
        SkillDto spring = new SkillDto(2L, "Spring Boot", "Backend", 85, 2);
        SkillDto react = new SkillDto(3L, "React", "Frontend", 80, 1);

        List<SkillsByCategoryDto> grouped = List.of(
                new SkillsByCategoryDto("Backend", List.of(java, spring)),
                new SkillsByCategoryDto("Frontend", List.of(react))
        );
        when(skillService.getSkillsGroupedByCategory()).thenReturn(grouped);

        mockMvc.perform(get("/api/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("Backend"))
                .andExpect(jsonPath("$[0].skills[0].name").value("Java"))
                .andExpect(jsonPath("$[0].skills[1].name").value("Spring Boot"))
                .andExpect(jsonPath("$[1].category").value("Frontend"))
                .andExpect(jsonPath("$[1].skills[0].name").value("React"));
    }

    @Test
    void getSkills_returnsEmptyWhenNoSkills() throws Exception {
        when(skillService.getSkillsGroupedByCategory()).thenReturn(List.of());

        mockMvc.perform(get("/api/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }
}
