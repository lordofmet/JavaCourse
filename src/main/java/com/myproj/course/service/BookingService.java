package com.myproj.course.service;

import com.myproj.course.model.Booking;
import com.myproj.course.model.Property;
import com.myproj.course.model.SalesStatistics;
import com.myproj.course.repository.BookingRepository;
import com.myproj.course.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    public Booking createBooking(Booking booking) {
        double totalPrice = booking.getTotalPrice();

        // Убедитесь, что totalPrice не равен 0, если bookingPricePerDay задан
        if (totalPrice == 0) {
            System.out.println(booking.getProperty().getPrice());
            System.out.println(totalPrice);
            throw new RuntimeException("Total price calculation failed. Check property price.");
        }

        booking.setTotalPrice(totalPrice);
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateBooking(Long id, Booking updatedBooking) {
        Booking existingBooking = getBookingById(id);
        existingBooking.setUser(updatedBooking.getUser());
        existingBooking.setProperty(updatedBooking.getProperty());
        existingBooking.setStartDate(updatedBooking.getStartDate());
        existingBooking.setEndDate(updatedBooking.getEndDate());
        existingBooking.setStatus(updatedBooking.getStatus());
        existingBooking.setTotalPrice(updatedBooking.getTotalPrice());
        return bookingRepository.save(existingBooking);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public List<Booking> getBookingsByOwnerId(Long ownerId) {
        // Получаем все свойства владельца
        List<Property> properties = propertyRepository.findByOwnerId(ownerId);

        // Для каждого свойства находим все бронирования
        List<Booking> bookings = new ArrayList<>();
        for (Property property : properties) {
            bookings.addAll(bookingRepository.findByPropertyId(property.getId()));
        }
        return bookings;
    }

    public SalesStatistics calculateSalesStatistics(Long ownerId) {
        List<Booking> bookings = getBookingsByOwnerId(ownerId);
        double totalSalesThisMonth = 0;
        double totalSalesThisYear = 0;
        double expectedPaymentsNextMonth = 0;
        double expectedPaymentsNextYear = 0;
        double averageMonthlyIncome = 0;

        LocalDate now = LocalDate.now();
        int monthNow = now.getMonthValue();
        int yearNow = now.getYear();

        for (Booking booking : bookings) {
            if (booking.getStatus().equals("paid")) {
                // Сумма продаж за текущий месяц
                if (booking.getStartDate().getMonthValue() == monthNow && booking.getStartDate().getYear() == yearNow) {
                    totalSalesThisMonth += booking.getTotalPrice();
                }
                // Сумма продаж за текущий год
                if (booking.getStartDate().getYear() == yearNow) {
                    totalSalesThisYear += booking.getTotalPrice();
                }
                // Предполагаемое поступление на следующий месяц (по всем бронированиям следующего месяца)
                if (booking.getStartDate().isAfter(now) && booking.getStartDate().getMonthValue() == monthNow + 1) {
                    expectedPaymentsNextMonth += booking.getTotalPrice();
                }
                // Предполагаемое поступление на следующий год
                if (booking.getStartDate().isAfter(now) && booking.getStartDate().getYear() == yearNow + 1) {
                    expectedPaymentsNextYear += booking.getTotalPrice();
                }
            }
        }

        // Расчет среднего дохода за последний год
        // Можете добавить дополнительную логику, чтобы учитывать только прошедшие месяцы года
        if (!bookings.isEmpty()) {
            averageMonthlyIncome = totalSalesThisYear / 12; // Простой расчет, можно уточнить
        }

        SalesStatistics salesStatistics = new SalesStatistics();
        salesStatistics.setOwnerId(ownerId);
        salesStatistics.setTotalSalesThisMonth(totalSalesThisMonth);
        salesStatistics.setTotalSalesThisYear(totalSalesThisYear);
        salesStatistics.setExpectedPaymentsNextMonth(expectedPaymentsNextMonth);
        salesStatistics.setExpectedPaymentsNextYear(expectedPaymentsNextYear);
        salesStatistics.setAverageMonthlyIncome(averageMonthlyIncome);

        return salesStatistics;
    }


}
