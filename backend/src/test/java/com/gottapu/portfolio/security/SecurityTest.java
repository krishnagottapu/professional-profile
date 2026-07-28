package com.gottapu.portfolio.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void adminBlogReturns401WithoutAuth() throws Exception {
        mockMvc.perform(get("/api/admin/blog"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    void authMeReturns401WithoutAuth() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void loginReturns200WithValidCredentials() throws Exception {
        String loginJson = "{\"username\":\"admin\",\"password\":\"admin123\"}";

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("admin"))
            .andExpect(jsonPath("$.loggedIn").value(true));
    }

    @Test
    void loginReturns401WithInvalidCredentials() throws Exception {
        String loginJson = "{\"username\":\"admin\",\"password\":\"wrongpassword\"}";

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.loggedIn").value(false));
    }

    @Test
    void adminEndpointAccessibleAfterLogin() throws Exception {
        String loginJson = "{\"username\":\"admin\",\"password\":\"admin123\"}";

        var loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
            .andExpect(status().isOk())
            .andReturn();

        var session = loginResult.getRequest().getSession();

        mockMvc.perform(get("/api/admin/blog").session((org.springframework.mock.web.MockHttpSession) session))
            .andExpect(status().isOk());
    }
}
