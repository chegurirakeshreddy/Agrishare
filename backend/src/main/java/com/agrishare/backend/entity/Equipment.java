
package com.agrishare.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "equipment")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String equipmentName;

    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal rentalPricePerDay;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private boolean available = true;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private AppUser owner;

    public Equipment() {}

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getEquipmentName() { return equipmentName; }
    public String getDescription() { return description; }
    public BigDecimal getRentalPricePerDay() {
        return rentalPricePerDay;
    }
    public String getLocation() { return location; }
    public boolean isAvailable() { return available; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public AppUser getOwner() { return owner; }

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
    public void setAvailable(boolean available) {
        this.available = available;
    }
    public void setOwner(AppUser owner) {
        this.owner = owner;
    }
}
