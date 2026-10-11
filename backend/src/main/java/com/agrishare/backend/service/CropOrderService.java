package com.agrishare.backend.service;

import com.agrishare.backend.dto.CropOrderRequest;
import com.agrishare.backend.entity.AppUser;
import com.agrishare.backend.entity.Crop;
import com.agrishare.backend.entity.CropOrder;
import com.agrishare.backend.repository.CropOrderRepository;
import com.agrishare.backend.repository.CropRepository;
import com.agrishare.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class CropOrderService {

    private final CropOrderRepository orderRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public CropOrderService(
            CropOrderRepository orderRepository,
            CropRepository cropRepository,
            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Map<String, Object> placeOrder(
            String email, CropOrderRequest request) {

        AppUser buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        if (!"BUYER".equalsIgnoreCase(
                String.valueOf(buyer.getRole()))) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Only buyers can purchase crops");
        }

        BigDecimal quantity = request.getQuantityKg();

        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Quantity must be greater than zero");
        }

        if (quantity.stripTrailingZeros().scale() > 2) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantity can have at most two decimal places");
        }

        Crop crop = cropRepository.findByIdForUpdate(request.getCropId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Crop not found"));

        if (!crop.isAvailable()
                || crop.getQuantityKg().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "This crop is no longer available");
        }

        if (crop.getFarmer().getId().equals(buyer.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot purchase your own crop");
        }

        if (quantity.compareTo(crop.getQuantityKg()) > 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Requested quantity exceeds available stock");
        }

        BigDecimal price = crop.getPricePerKg();
        BigDecimal total = price.multiply(quantity)
                .setScale(2, RoundingMode.HALF_UP);

        CropOrder order = new CropOrder();
        order.setCrop(crop);
        order.setBuyer(buyer);
        order.setQuantityKg(quantity);
        order.setPricePerKg(price);
        order.setTotalPrice(total);
        order.setStatus("PENDING");

        // Reduce stock within the same transaction.
        BigDecimal remaining = crop.getQuantityKg().subtract(quantity);
        crop.setQuantityKg(remaining);

        if (remaining.compareTo(BigDecimal.ZERO) <= 0) {
            crop.setAvailable(false);
        }

        cropRepository.save(crop);
        CropOrder savedOrder = orderRepository.save(order);

        return toMap(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMyOrders(String email) {
        AppUser buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        if (!"BUYER".equalsIgnoreCase(
                String.valueOf(buyer.getRole()))) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Only buyers can view their orders");
        }

        return orderRepository.findOrdersByBuyerId(buyer.getId())
                .stream()
                .map(this::toMap)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getOrdersReceived(String email) {
        AppUser farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        if (!"FARMER".equalsIgnoreCase(
                String.valueOf(farmer.getRole()))) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Only farmers can view received orders");
        }

        return orderRepository.findOrdersForFarmer(farmer.getId())
                .stream()
                .map(this::toMap)
                .toList();
    }

    private Map<String, Object> toMap(CropOrder order) {
        Map<String, Object> result = new LinkedHashMap<>();

        result.put("id", order.getId());
        result.put("cropId", order.getCrop().getId());
        result.put("cropName", order.getCrop().getCropName());
        result.put("farmerName", order.getCrop().getFarmer().getName());
        result.put("buyerName", order.getBuyer().getName());
        result.put("quantityKg", order.getQuantityKg());
        result.put("pricePerKg", order.getPricePerKg());
        result.put("totalPrice", order.getTotalPrice());
        result.put("status", order.getStatus());
        result.put("createdAt", order.getCreatedAt());

        return result;
    }
}