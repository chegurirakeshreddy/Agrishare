
package com.agrishare.backend.service;

import com.agrishare.backend.entity.Crop;
import com.agrishare.backend.repository.CropRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class CropRecommendationService {

    private final CropRepository cropRepository;

    public CropRecommendationService(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    public List<Recommendation> recommend(
            BigDecimal budget,
            BigDecimal quantityKg,
            String cropName) {

        if (budget == null || budget.signum() < 0) {
            throw new IllegalArgumentException(
                    "Budget cannot be negative.");
        }

        if (quantityKg == null || quantityKg.signum() <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero.");
        }

        String preference = cropName == null
                ? ""
                : cropName.trim().toLowerCase(Locale.ROOT);

        return cropRepository.findByAvailableTrueOrderByCreatedAtDesc()
                .stream()
                .filter(crop -> crop.getQuantityKg()
                        .compareTo(quantityKg) >= 0)
                .map(crop -> {
                    BigDecimal total = crop.getPricePerKg()
                            .multiply(quantityKg);

                    boolean matchesPreference = !preference.isEmpty()
                            && crop.getCropName() != null
                            && crop.getCropName().toLowerCase(Locale.ROOT)
                                    .contains(preference);

                    String reason = matchesPreference
                            ? "Matches your crop preference."
                            : "Available in the required quantity.";

                    return new Recommendation(
                            crop.getId(),
                            crop.getCropName(),
                            crop.getPricePerKg(),
                            crop.getQuantityKg(),
                            quantityKg,
                            total,
                            crop.getLocation(),
                            reason,
                            total.compareTo(budget) <= 0,
                            matchesPreference
                    );
                })
                .filter(item -> item.totalCost().compareTo(budget) <= 0)
                .sorted(
                        Comparator.comparing(
                                Recommendation::matchesPreference
                        ).reversed()
                        .thenComparing(Recommendation::totalCost)
                )
                .toList();
    }

    public record Recommendation(
            Long id,
            String cropName,
            BigDecimal pricePerKg,
            BigDecimal availableQuantityKg,
            BigDecimal requestedQuantityKg,
            BigDecimal totalCost,
            String location,
            String reason,
            boolean withinBudget,
            boolean matchesPreference
    ) {}
}
