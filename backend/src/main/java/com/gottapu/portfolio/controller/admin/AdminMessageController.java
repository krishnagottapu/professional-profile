package com.gottapu.portfolio.controller.admin;

import com.gottapu.portfolio.entity.ContactMessage;
import com.gottapu.portfolio.service.admin.AdminMessageService;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/messages")
public class AdminMessageController {

    private final AdminMessageService adminMessageService;

    public AdminMessageController(AdminMessageService adminMessageService) {
        this.adminMessageService = adminMessageService;
    }

    @GetMapping
    public List<ContactMessage> getAllMessages() {
        return adminMessageService.getAllMessages();
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount() {
        return Map.of("count", adminMessageService.getUnreadCount());
    }

    @PatchMapping("/{id}/read")
    public ContactMessage markAsRead(@PathVariable Long id) {
        return adminMessageService.markAsRead(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        adminMessageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
