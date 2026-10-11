
package com.agrishare.backend.service;

import org.springframework.stereotype.Service;

@Service
public class FarmingAssistantService {

    public String getAnswer(String question) {
        if (question == null || question.trim().isEmpty()) {
            return "Please enter a farming question.";
        }

        String q = question.toLowerCase();

        if (q.contains("rice") || q.contains("paddy")) {
            return "Rice generally needs plenty of water and suitable "
                + "soil. Choose a variety suited to your local climate, "
                + "and follow local agricultural guidance.";
        }

        if (q.contains("water") || q.contains("irrigation")) {
            return "Water crops according to soil moisture, crop stage, "
                + "and weather. Drip irrigation can help reduce water "
                + "wastage for suitable crops.";
        }

        if (q.contains("soil")) {
            return "Check soil pH and nutrient levels through a soil "
                + "test. Use the results to choose suitable crops and "
                + "apply fertilizers in recommended amounts.";
        }

        if (q.contains("pest") || q.contains("insect")) {
            return "Inspect crops regularly and identify the pest "
                + "before treatment. Consider integrated pest management "
                + "and consult a local agricultural expert.";
        }

        if (q.contains("fertilizer") || q.contains("fertiliser")) {
            return "Choose fertilizer based on soil-test results and "
                + "crop requirements. Avoid applying more than the "
                + "recommended amount.";
        }

        if (q.contains("tomato")) {
            return "Tomatoes need suitable sunlight, well-drained soil, "
                + "regular watering, and support where required. Monitor "
                + "plants for pests and disease.";
        }

        if (q.contains("budget") || q.contains("recommend")) {
            return "Try AgriShare Smart Crop Recommendations. Enter "
                + "your budget, required quantity, and preferred crop "
                + "to find available crops matching your needs.";
        }

        if (q.contains("hello") || q.contains("hi")) {
            return "Hello! I am your AgriShare Farming Assistant. "
                + "Ask me about crops, irrigation, soil, pests, "
                + "or fertilizers.";
        }

        return "I can help with basic questions about crops, water, "
            + "soil, pests, and fertilizers. Please try asking about "
            + "one of these topics, or consult a local agricultural "
            + "expert for crop-specific advice.";
    }
}
