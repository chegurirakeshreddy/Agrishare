
package com.agrishare.backend.service;

import com.agrishare.backend.dto.CropRequest;
import com.agrishare.backend.entity.AppUser;
import com.agrishare.backend.entity.Crop;
import com.agrishare.backend.repository.CropRepository;
import com.agrishare.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CropService {

    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public CropService(
            CropRepository cropRepository,
            UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
    }

    public Crop addCrop(CropRequest request, String email) {

        AppUser farmer = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));

        if (!"FARMER".equals(farmer.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only farmers can add crops");
        }

        Crop crop = new Crop();
        crop.setCropName(request.cropName().trim());
        crop.setDescription(request.description());
        crop.setPricePerKg(request.pricePerKg());
        crop.setQuantityKg(request.quantityKg());
        crop.setLocation(request.location().trim());
        crop.setFarmer(farmer);

        return cropRepository.save(crop);
    }

    public List<Crop> getAvailableCrops() {
        return cropRepository.findByAvailableTrueOrderByCreatedAtDesc();
    }

    public List<Crop> getMyCrops(String email) {

        AppUser farmer = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));

        if (!"FARMER".equals(farmer.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only farmers can view their crop listings");
        }

        return cropRepository
                .findByFarmerIdOrderByCreatedAtDesc(farmer.getId());
    }
}
