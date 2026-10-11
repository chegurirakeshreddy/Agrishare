
package com.agrishare.backend;

import com.agrishare.backend.entity.EquipmentBooking;
import com.agrishare.backend.service.EquipmentBookingService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentBookingController {

    private final EquipmentBookingService bookingService;

    public EquipmentBookingController(
            EquipmentBookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/{equipmentId}/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createBooking(
            @PathVariable Long equipmentId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        LocalDate startDate =
                LocalDate.parse(request.get("startDate"));
        LocalDate endDate =
                LocalDate.parse(request.get("endDate"));

        EquipmentBooking booking = bookingService.createBooking(
                equipmentId,
                startDate,
                endDate,
                authentication.getName()
        );

        return toResponse(booking);
    }

    @GetMapping("/bookings/my")
    public List<Map<String, Object>> getMyBookings(
            Authentication authentication) {
        return bookingService.getMyBookings(authentication.getName())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/bookings/received")
    public List<Map<String, Object>> getReceivedBookings(
            Authentication authentication) {
        return bookingService.getReceivedBookings(authentication.getName())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    
    @PatchMapping("/bookings/{bookingId}/status")
    public Map<String, Object> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        String status = request.get("status");

        EquipmentBooking booking =
                bookingService.updateBookingStatus(
                        bookingId,
                        status,
                        authentication.getName());

        return toResponse(booking);
    }


    private Map<String, Object> toResponse(EquipmentBooking booking) {
        Map<String, Object> response = new HashMap<>();

        response.put("id", booking.getId());
        response.put("equipmentId", booking.getEquipment().getId());
        response.put("equipmentName",
                booking.getEquipment().getEquipmentName());
        response.put("ownerName",
                booking.getEquipment().getOwner().getName());
        response.put("renterName", booking.getRenter().getName());
        response.put("startDate", booking.getStartDate());
        response.put("endDate", booking.getEndDate());
        response.put("totalPrice", booking.getTotalPrice());
        response.put("status", booking.getStatus());
        response.put("createdAt", booking.getCreatedAt());

        return response;
    }
}
