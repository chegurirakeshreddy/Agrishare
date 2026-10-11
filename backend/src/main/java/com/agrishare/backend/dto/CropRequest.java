
package com.agrishare.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CropRequest(

    @NotBlank(message = "Crop name is required")
    @Size(max = 100)
    String cropName,

    @Size(max = 500)
    String description,

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    BigDecimal pricePerKg,

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.01", message = "Quantity must be greater than zero")
    BigDecimal quantityKg,

    @NotBlank(message = "Location is required")
    @Size(max = 150)
    String location

) {}
