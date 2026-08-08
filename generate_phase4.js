const fs = require('fs');
const path = require('path');

const basePath = "C:\\Users\\Faisal Khan\\.gemini\\antigravity-ide\\scratch\\ai-tech-erp\\backend\\src\\main\\java\\com\\aitech\\erp";

const files = {
  "services/AIService.java": `package com.aitech.erp.services;
import org.springframework.stereotype.Service;

@Service
public class AIService {
  public String generateDailyReport() {
    return "AI Summary: The team completed 12 tasks today. Attendance is at 95%. Productivity is high, but Project Alpha is slightly behind schedule. Recommend reassigning 2 developers to Alpha.";
  }

  public String getTaskRecommendations(Long employeeId) {
    return "Based on past performance, Employee " + employeeId + " excels at Backend Development. Recommended to assign 'Implement JWT Auth' and 'Database Optimization' with priority HIGH.";
  }

  public String generatePerformanceSummary(Long employeeId) {
    return "Performance Score: 88/100. Employee has shown great leadership in recent sprints. 100% attendance this month. Recommended for a senior role evaluation.";
  }

  public String chatAssistant(String query) {
    if (query.toLowerCase().contains("leave")) return "Company policy allows 15 casual leaves and 10 sick leaves per year.";
    if (query.toLowerCase().contains("attendance")) return "Core working hours are 10 AM to 4 PM. You must complete 8 hours daily.";
    return "I am the AI Tech ERP assistant. I can answer HR, Leave, and Project related queries.";
  }
}`,

  "controllers/AIController.java": `package com.aitech.erp.controllers;
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
}`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log("Phase 4 AI backend files generated successfully.");
