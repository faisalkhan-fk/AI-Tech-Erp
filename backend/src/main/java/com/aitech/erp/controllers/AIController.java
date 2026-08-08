package com.aitech.erp.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.aitech.erp.services.AIService;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AIController {
  @Autowired AIService aiService;

  @GetMapping("/report")
  public Map<String, String> getDailyReport() {
    Map<String, String> res = new HashMap<>();
    res.put("report", aiService.generateDailyReport());
    return res;
  }

  @GetMapping("/recommendations/{empId}")
  public Map<String, String> getRecommendations(@PathVariable Long empId) {
    Map<String, String> res = new HashMap<>();
    res.put("recommendation", aiService.getTaskRecommendations(empId));
    return res;
  }

  @GetMapping("/performance/{empId}")
  public Map<String, String> getPerformance(@PathVariable Long empId) {
    Map<String, String> res = new HashMap<>();
    res.put("summary", aiService.generatePerformanceSummary(empId));
    return res;
  }

  @PostMapping("/chat")
  public Map<String, String> chat(@RequestBody Map<String, String> payload) {
    Map<String, String> res = new HashMap<>();
    res.put("response", aiService.chatAssistant(payload.get("query")));
    return res;
  }
}