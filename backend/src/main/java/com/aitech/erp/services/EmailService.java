package com.aitech.erp.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetOtp(String toEmail, String userName, String otp) {
        String subject = "AI Tech ERP - Password Reset OTP";
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;\">" +
                "<h2 style=\"color: #1a56db; text-align: center;\">AI Tech ERP</h2>" +
                "<p>Hello " + userName + ",</p>" +
                "<p>We received a request to reset your AI Tech ERP account password.</p>" +
                "<p>Your OTP is:</p>" +
                "<div style=\"background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;\">" + otp + "</div>" +
                "<p style=\"color: #ef4444; font-size: 14px;\">This OTP will expire in 5 minutes.</p>" +
                "<p style=\"font-size: 14px; color: #6b7280;\">If you did not request a password reset, please ignore this email.</p>" +
                "<hr style=\"border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;\" />" +
                "<p style=\"font-size: 12px; color: #9ca3af; text-align: center;\">Regards,<br/>AI Tech ERP Team</p>" +
                "</div>";

        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    public void sendPasswordResetSuccess(String toEmail, String userName) {
        String subject = "AI Tech ERP - Password Reset Successful";
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;\">" +
                "<h2 style=\"color: #10b981; text-align: center;\">Password Reset Successful</h2>" +
                "<p>Hello " + userName + ",</p>" +
                "<p>Your AI Tech ERP account password has been successfully reset.</p>" +
                "<p style=\"font-size: 14px; color: #6b7280;\">If you did not perform this action, please contact the administrator immediately.</p>" +
                "<hr style=\"border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;\" />" +
                "<p style=\"font-size: 12px; color: #9ca3af; text-align: center;\">Regards,<br/>AI Tech ERP Team</p>" +
                "</div>";

        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String senderEmail;

    @org.springframework.beans.factory.annotation.Value("${APP_SCRIPT_EMAIL_URL:}")
    private String appScriptUrl;

    private void sendHtmlEmail(String toEmail, String subject, String htmlContent) {
        // Fallback for Render Free Tier: If APP_SCRIPT_EMAIL_URL is provided, send via HTTP (bypasses SMTP block)
        if (appScriptUrl != null && !appScriptUrl.trim().isEmpty()) {
            try {
                org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
                
                java.util.Map<String, String> payload = new java.util.HashMap<>();
                payload.put("to", toEmail);
                payload.put("subject", subject);
                payload.put("html", htmlContent);
                payload.put("name", "AI Tech ERP");
                
                org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
                headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
                
                org.springframework.http.HttpEntity<java.util.Map<String, String>> request = new org.springframework.http.HttpEntity<>(payload, headers);
                
                org.springframework.http.ResponseEntity<String> response = restTemplate.postForEntity(appScriptUrl, request, String.class);
                System.out.println("Email sent via App Script: " + response.getBody());
                return; // Exit after successful HTTP send
            } catch (Exception e) {
                System.err.println("Failed to send email via App Script API: " + e.getMessage());
                throw new org.springframework.mail.MailSendException("App Script Email Failed: " + e.getMessage());
            }
        }

        // Default local behavior: Send via standard SMTP
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            // Set the sender name to "AI Tech ERP" with the actual authenticated email
            helper.setFrom(senderEmail, "AI Tech ERP");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (jakarta.mail.MessagingException | java.io.UnsupportedEncodingException e) {
            e.printStackTrace();
            System.err.println("Failed to construct email for " + toEmail);
        }
    }
}
