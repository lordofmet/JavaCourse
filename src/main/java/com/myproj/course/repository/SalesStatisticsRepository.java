package com.myproj.course.repository;

import com.myproj.course.model.SalesStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalesStatisticsRepository extends JpaRepository<SalesStatistics, Long> {
    SalesStatistics findByOwnerId(Long ownerId);
}
