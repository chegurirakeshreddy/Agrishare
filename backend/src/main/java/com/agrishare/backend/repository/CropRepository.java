
package com.agrishare.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.agrishare.backend.entity.Crop;

public interface CropRepository extends JpaRepository<Crop, Long> {

    @Query("SELECT c FROM Crop c JOIN FETCH c.farmer WHERE c.available = true ORDER BY c.createdAt DESC")
    List<Crop> findByAvailableTrueOrderByCreatedAtDesc();

    @Query("SELECT c FROM Crop c JOIN FETCH c.farmer WHERE c.farmer.id = :farmerId ORDER BY c.createdAt DESC")
    List<Crop> findByFarmerIdOrderByCreatedAtDesc(@Param("farmerId") Long farmerId);
   
    @Query(value = "SELECT * FROM crops WHERE id = :cropId FOR UPDATE",
            nativeQuery = true)
    Optional<Crop> findByIdForUpdate(@Param("cropId") Long cropId);

}