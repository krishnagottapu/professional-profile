package com.gottapu.portfolio.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.resend.api-key:}")
    private String resendApiKey;

    @Value("${app.resend.from:Portfolio <onboarding@resend.dev>}")
    private String fromEmail;

    @Async("emailExecutor")
    public void sendContactNotification(String senderName, String senderEmail, String messageBody) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            log.warn("Resend API key not configured. Skipping email for sender: {}", senderName);
            return;
        }

        try {
            String jsonBody = String.format("""
                    {
                      "from": "%s",
                      "to": ["%s"],
                      "subject": "New Contact Form Submission from %s",
                      "text": "%s"
                    }
                    """,
                    escapeJson(fromEmail),
                    escapeJson(adminEmail),
                    escapeJson(senderName),
                    escapeJson(buildEmailBody(senderName, senderEmail, messageBody))
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                log.info("Contact notification email sent via Resend for sender: {}", senderName);
            } else {
                log.warn("Resend API returned status {} for sender {}: {}",
                        response.statusCode(), senderName, response.body());
            }
        } catch (Exception e) {
            log.warn("Failed to send contact email notification for sender {}: {}",
                    senderName, e.getMessage());
        }
    }

    private String buildEmailBody(String senderName, String senderEmail, String messageBody) {
        return String.format(
                "New contact form submission from your portfolio website.%n%n"
                        + "From: %s%n"
                        + "Email: %s%n%n"
                        + "Message:%n%s",
                senderName,
                senderEmail,
                messageBody
        );
    }

    private String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
