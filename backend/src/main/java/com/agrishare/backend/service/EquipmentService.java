
package com.agrishare.backend.service;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agrishare.backend.dto.EquipmentRequest;
import com.agrishare.backend.entity.AppUser;
import com.agrishare.backend.entity.Equipment;
import com.agrishare.backend.repository.EquipmentRepository;
import com.agrishare.backend.repository.UserRepository;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;

    public EquipmentService(
            EquipmentRepository equipmentRepository,
            UserRepository userRepository) {
        this.equipmentRepository = equipmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Equipment addEquipment(
            EquipmentRequest request, String email) {

        AppUser owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("User not found"));

        if (!"FARMER".equalsIgnoreCase(owner.getRole())) {
            throw new AccessDeniedException(
                    "Only farmers can list equipment");
        }

        Equipment equipment = new Equipment();
        equipment.setEquipmentName(request.getEquipmentName());
        equipment.setDescription(request.getDescription());
        equipment.setRentalPricePerDay(
                request.getRentalPricePerDay());
        equipment.setLocation(request.getLocation());
        equipment.setOwner(owner);

        return equipmentRepository.save(equipment);
    }

    public List<Equipment> getAvailableEquipment() {
        return equipmentRepository.findAvailableEquipment();
    }

    @Transactional(readOnly = true)
    public List<Equipment> getMyEquipment(String email) {
        AppUser owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("User not found"));

        return equipmentRepository.findByOwnerId(owner.getId());
    }
}
