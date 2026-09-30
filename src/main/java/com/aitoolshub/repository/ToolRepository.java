package com.aitoolshub.repository;

import com.aitoolshub.model.Tool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ToolRepository extends JpaRepository<Tool, Long> {

    List<Tool> findByCategoryIgnoreCase(String category);

    @Query("SELECT t FROM Tool t WHERE " +
           "LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.features) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Tool> searchTools(@Param("keyword") String keyword);

    @Query("SELECT t.category, COUNT(t) FROM Tool t GROUP BY t.category")
    List<Object[]> countToolsByCategory();
}
