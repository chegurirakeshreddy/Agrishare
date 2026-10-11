
package com.agrishare.backend.repository;

import com.agrishare.backend.entity.EquipmentBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EquipmentBookingRepository
        extends JpaRepository<EquipmentBooking, Long> {

    @Query("""
        SELECT b FROM EquipmentBooking b
        JOIN FETCH b.equipment e
        JOIN FETCH e.owner
        JOIN FETCH b.renter
        WHERE b.renter.id = :renterId
        ORDER BY b.createdAt DESC
    """)
    List<EquipmentBooking> findMyBookings(
            @Param("renterId") Long renterId);

    @Query("""
        SELECT b FROM EquipmentBooking b
        JOIN FETCH b.equipment e
        JOIN FETCH e.owner
        JOIN FETCH b.renter
        WHERE e.owner.id = :ownerId
        ORDER BY b.createdAt DESC
    """)
    List<EquipmentBooking> findReceivedBookings(
            @Param("ownerId") Long ownerId);

    
    @Query("""
        SELECT COUNT(b) FROM EquipmentBooking b
        WHERE b.equipment.id = :equipmentId
          AND b.status = 'APPROVED'
          AND b.startDate <= :endDate
          AND b.endDate >= :startDate
    """)
    long countOverlappingApprovedBookings(
            @Param("equipmentId") Long equipmentId,
            @Param("startDate") java.time.LocalDate startDate,
            @Param("endDate") java.time.LocalDate endDate);

}
