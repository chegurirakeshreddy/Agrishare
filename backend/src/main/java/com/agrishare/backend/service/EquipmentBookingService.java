
package com.agrishare.backend.service;

import java.util.Optional;

import com.agrishare.backend.entity.AppUser;
import com.agrishare.backend.entity.Equipment;
import com.agrishare.backend.entity.EquipmentBooking;
import com.agrishare.backend.repository.EquipmentBookingRepository;
import com.agrishare.backend.repository.EquipmentRepository;
import com.agrishare.backend.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class EquipmentBookingService {

    private final EquipmentBookingRepository bookingRepository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;

    public EquipmentBookingService(
            EquipmentBookingRepository bookingRepository,
            EquipmentRepository equipmentRepository,
            UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.equipmentRepository = equipmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public EquipmentBooking createBooking(
            Long equipmentId, LocalDate startDate,
            LocalDate endDate, String renterEmail) {

        if (startDate == null || endDate == null
                || startDate.isBefore(LocalDate.now())
                || endDate.isBefore(startDate)) {
            throw new IllegalArgumentException(
                    "Please select valid rental dates.");
        }

        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Equipment not found."));

        if (!equipment.isAvailable()) {
            throw new IllegalArgumentException(
                    "This equipment is not available.");
        }

        AppUser renter = userRepository.findByEmail(renterEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found."));

        if (equipment.getOwner().getId().equals(renter.getId())) {
            throw new AccessDeniedException(
                    "You cannot book your own equipment.");
        }

        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;

        BigDecimal totalPrice = equipment.getRentalPricePerDay()
                .multiply(BigDecimal.valueOf(days));

        EquipmentBooking booking = new EquipmentBooking();
        booking.setEquipment(equipment);
        booking.setRenter(renter);
        booking.setStartDate(startDate);
        booking.setEndDate(endDate);
        booking.setTotalPrice(totalPrice);
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    public List<EquipmentBooking> getMyBookings(String email) {
        AppUser renter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found."));

        return bookingRepository.findMyBookings(renter.getId());
    }

    public List<EquipmentBooking> getReceivedBookings(String email) {
        AppUser owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found."));

        return bookingRepository.findReceivedBookings(owner.getId());
    }

    
    @Transactional
    public EquipmentBooking updateBookingStatus(
            Long bookingId, String newStatus, String ownerEmail) {

        if (!"APPROVED".equals(newStatus)
                && !"REJECTED".equals(newStatus)) {
            throw new IllegalArgumentException(
                    "Status must be APPROVED or REJECTED.");
        }

        EquipmentBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Booking not found."));

        AppUser owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found."));

        if (!booking.getEquipment().getOwner().getId()
                .equals(owner.getId())) {
            throw new AccessDeniedException(
                    "Only the equipment owner can update this request.");
        }

        if (!"PENDING".equals(booking.getStatus())) {
            throw new IllegalArgumentException(
                    "This request has already been processed.");
        }

        if ("APPROVED".equals(newStatus)) {
            long overlaps =
                    bookingRepository.countOverlappingApprovedBookings(
                            booking.getEquipment().getId(),
                            booking.getStartDate(),
                            booking.getEndDate());

            if (overlaps > 0) {
                throw new IllegalArgumentException(
                        "These dates overlap with another approved booking.");
            }
        }

        booking.setStatus(newStatus);
        return bookingRepository.save(booking);
    }

}
