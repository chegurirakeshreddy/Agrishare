
package com.agrishare.backend;

import com.agrishare.backend.service.CropRecommendationService;
import com.agrishare.backend.service.CropRecommendationService.Recommendation;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final CropRecommendationService service;

    public RecommendationController(CropRecommendationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Recommendation> recommend(
            @RequestParam BigDecimal budget,
            @RequestParam BigDecimal quantityKg,
            @RequestParam(required = false) String cropName) {

        try {
            return service.recommend(budget, quantityKg, cropName);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
