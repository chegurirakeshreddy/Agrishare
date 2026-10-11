
package com.agrishare.backend;

import com.agrishare.backend.dto.CropRequest;
import com.agrishare.backend.entity.Crop;
import com.agrishare.backend.service.CropService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @PostMapping
    public ResponseEntity<?> addCrop(
            @Valid @RequestBody CropRequest request,
            Authentication authentication) {

        Crop crop = cropService.addCrop(
                request, authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toResponse(crop));
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCrops() {

        List<Map<String, Object>> crops = cropService
                .getAvailableCrops()
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(crops);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMyCrops(
            Authentication authentication) {

        List<Map<String, Object>> crops = cropService
                .getMyCrops(authentication.getName())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(crops);
    }

    private Map<String, Object> toResponse(Crop crop) {

        Map<String, Object> response = new HashMap<>();

        response.put("id", crop.getId());
        response.put("cropName", crop.getCropName());
        response.put("description", crop.getDescription());
        response.put("pricePerKg", crop.getPricePerKg());
        response.put("quantityKg", crop.getQuantityKg());
        response.put("location", crop.getLocation());
        response.put("available", crop.isAvailable());
        response.put("createdAt", crop.getCreatedAt());
        response.put("farmerName", crop.getFarmer().getName());

        return response;
    }
}
