package com.gottapu.portfolio.controller;

import com.gottapu.portfolio.config.SecurityConfig;
import com.gottapu.portfolio.dto.ContactRequest;
import com.gottapu.portfolio.dto.ContactResponse;
import com.gottapu.portfolio.service.ContactService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ContactController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
    "spring.security.user.name=admin",
    "spring.security.user.password=admin123"
})
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ContactService contactService;

    @Test
    void submitContact_validRequest_returns201() throws Exception {
        ContactRequest request = new ContactRequest("John Doe", "john@example.com", "Hello!", null);
        when(contactService.saveMessage(any(ContactRequest.class)))
                .thenReturn(new ContactResponse(true, "Message sent successfully"));

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Message sent successfully"));

        verify(contactService).saveMessage(any(ContactRequest.class));
    }

    @Test
    void submitContact_missingName_returns400() throws Exception {
        ContactRequest request = new ContactRequest("", "john@example.com", "Hello!", null);

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fields.name").exists());
    }

    @Test
    void submitContact_invalidEmail_returns400() throws Exception {
        ContactRequest request = new ContactRequest("John Doe", "not-an-email", "Hello!", null);

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fields.email").exists());
    }

    @Test
    void submitContact_missingMessage_returns400() throws Exception {
        ContactRequest request = new ContactRequest("John Doe", "john@example.com", "", null);

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fields.message").exists());
    }

    @Test
    void submitContact_honeypotPopulated_returns201ButDoesNotSave() throws Exception {
        ContactRequest request = new ContactRequest("Bot", "bot@spam.com", "Buy stuff!", "bot-value");

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));

        verify(contactService, never()).saveMessage(any(ContactRequest.class));
    }
}
