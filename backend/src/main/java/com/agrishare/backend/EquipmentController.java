
package com.agrishare.backend;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agrishare.backend.dto.EquipmentRequest;
import com.agrishare.backend.entity.Equipment;
import com.agrishare.backend.service.EquipmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentService equipmentService;

    public EquipmentController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @PostMapping
    public ResponseEntity<?> addEquipment(
            @Valid @RequestBody EquipmentRequest request,
            Authentication authentication) {

        Equipment equipment = equipmentService.addEquipment(
                request, authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toResponse(equipment));
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getEquipment() {

        List<Map<String, Object>> equipmentList =
                equipmentService.getAvailableEquipment()
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(equipmentList);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMyEquipment(
            Authentication authentication) {

        List<Map<String, Object>> equipmentList =
                equipmentService.getMyEquipment(
                        authentication.getName())
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(equipmentList);
    }

    private Map<String, Object> toResponse(Equipment equipment) {

        Map<String, Object> response = new HashMap<>();

        response.put("id", equipment.getId());
        response.put("equipmentName", equipment.getEquipmentName());
        response.put("description", equipment.getDescription());
        response.put("rentalPricePerDay",
                equipment.getRentalPricePerDay());
        response.put("location", equipment.getLocation());
        response.put("available", equipment.isAvailable());
        response.put("createdAt", equipment.getCreatedAt());
        response.put("ownerName", equipment.getOwner().getName());

        return response;
    }
}
