package com.agrishare.backend.repository;

import com.agrishare.backend.entity.CropOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CropOrderRepository extends JpaRepository<CropOrder, Long> {

    @Query("""
        SELECT o FROM CropOrder o
        JOIN FETCH o.crop c
        JOIN FETCH c.farmer
        JOIN FETCH o.buyer
        WHERE o.buyer.id = :buyerId
        ORDER BY o.createdAt DESC
        """)
    List<CropOrder> findOrdersByBuyerId(@Param("buyerId") Long buyerId);

    @Query("""
        SELECT o FROM CropOrder o
        JOIN FETCH o.crop c
        JOIN FETCH c.farmer
        JOIN FETCH o.buyer
        WHERE c.farmer.id = :farmerId
        ORDER BY o.createdAt DESC
        """)
    List<CropOrder> findOrdersForFarmer(@Param("farmerId") Long farmerId);
}