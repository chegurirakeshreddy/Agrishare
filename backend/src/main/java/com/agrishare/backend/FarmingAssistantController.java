
package com.agrishare.backend;

import com.agrishare.backend.service.FarmingAssistantService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/assistant")
public class FarmingAssistantController {

    private final FarmingAssistantService assistantService;

    public FarmingAssistantController(
            FarmingAssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(
            @RequestBody Map<String, String> request) {

        String question = request.get("question");
        String answer = assistantService.getAnswer(question);

        return Map.of("answer", answer);
    }
}
