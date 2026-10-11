
package com.agrishare.backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class EquipmentRequest {

    @NotBlank
    @Size(max = 100)
    private String equipmentName;

    @Size(max = 1000)
    private String description;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal rentalPricePerDay;

    @NotBlank
    @Size(max = 150)
    private String location;

    public String getEquipmentName() {
        return equipmentName;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getRentalPricePerDay() {
        return rentalPricePerDay;
    }

    public String getLocation() {
        return location;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setRentalPricePerDay(BigDecimal price) {
        this.rentalPricePerDay = price;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
