package com.myproj.course.model;

import jakarta.persistence.*;

@Entity
public class SalesStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ownerId;

    private double totalSalesThisMonth;         // покупки за месяц
    private double totalSalesThisYear;          // покупки за год
    private double expectedPaymentsNextMonth;   // Ожидаемые платежи на следующий месяц
    private double expectedPaymentsNextYear;    // Ожидаемые платежи на год вперед
    private double averageMonthlyIncome;        // Средний доход в месяц за год


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public double getTotalSalesThisMonth() {
        return totalSalesThisMonth;
    }

    public void setTotalSalesThisMonth(double totalSalesThisMonth) {
        this.totalSalesThisMonth = totalSalesThisMonth;
    }

    public double getTotalSalesThisYear() {
        return totalSalesThisYear;
    }

    public void setTotalSalesThisYear(double totalSalesThisYear) {
        this.totalSalesThisYear = totalSalesThisYear;
    }

    public double getExpectedPaymentsNextMonth() {
        return expectedPaymentsNextMonth;
    }

    public void setExpectedPaymentsNextMonth(double expectedPaymentsNextMonth) {
        this.expectedPaymentsNextMonth = expectedPaymentsNextMonth;
    }

    public double getExpectedPaymentsNextYear() {
        return expectedPaymentsNextYear;
    }

    public void setExpectedPaymentsNextYear(double expectedPaymentsNextYear) {
        this.expectedPaymentsNextYear = expectedPaymentsNextYear;
    }

    public double getAverageMonthlyIncome() {
        return averageMonthlyIncome;
    }

    public void setAverageMonthlyIncome(double averageMonthlyIncome) {
        this.averageMonthlyIncome = averageMonthlyIncome;
    }
}
