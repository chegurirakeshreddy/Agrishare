
package com.agrishare.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.agrishare.backend.entity.Equipment;

public interface EquipmentRepository
        extends JpaRepository<Equipment, Long> {

    @Query("""
        SELECT e FROM Equipment e
        JOIN FETCH e.owner
        WHERE e.available = true
        ORDER BY e.createdAt DESC
    """)
    List<Equipment> findAvailableEquipment();

    @Query("""
        SELECT e FROM Equipment e
        JOIN FETCH e.owner
        WHERE e.owner.id = :ownerId
        ORDER BY e.createdAt DESC
    """)
    List<Equipment> findByOwnerId(@Param("ownerId") Long ownerId);
}
