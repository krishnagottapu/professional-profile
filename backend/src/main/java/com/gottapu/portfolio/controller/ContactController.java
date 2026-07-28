package com.gottapu.portfolio.controller;

import com.gottapu.portfolio.dto.ContactRequest;
import com.gottapu.portfolio.dto.ContactResponse;
import com.gottapu.portfolio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<ContactResponse> submitContact(@Valid @RequestBody ContactRequest request) {
        // Honeypot check: silently discard if populated
        if (request.honeypot() != null && !request.honeypot().isBlank()) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ContactResponse(true, "Message sent successfully"));
        }

        ContactResponse response = contactService.saveMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
