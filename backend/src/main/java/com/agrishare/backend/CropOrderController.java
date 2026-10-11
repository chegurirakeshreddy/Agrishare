package com.agrishare.backend;

import com.agrishare.backend.dto.CropOrderRequest;
import com.agrishare.backend.service.CropOrderService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crop-orders")
public class CropOrderController {

    private final CropOrderService orderService;

    public CropOrderController(CropOrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> placeOrder(
            @Valid @RequestBody CropOrderRequest request,
            Authentication authentication) {

        Map<String, Object> order = orderService.placeOrder(
                authentication.getName(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping("/my")
    public List<Map<String, Object>> getMyOrders(
            Authentication authentication) {

        return orderService.getMyOrders(authentication.getName());
    }

    @GetMapping("/received")
    public List<Map<String, Object>> getReceivedOrders(
            Authentication authentication) {

        return orderService.getOrdersReceived(authentication.getName());
    }
}