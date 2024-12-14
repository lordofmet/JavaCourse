package com.myproj.course.controller;

import com.myproj.course.model.Booking;
import com.myproj.course.model.Property;
import com.myproj.course.model.SalesStatistics;
import com.myproj.course.repository.PropertyRepository;
import com.myproj.course.repository.UserRepository;
import com.myproj.course.service.BookingService;
import com.myproj.course.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyService propertyService;

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {

        Property property = propertyService.getPropertyById(booking.getProperty().getId());

        double price = property.getPrice();
        double priceBooking = property.getBookingPricePerDay();

        long days = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate());
        booking.setTotalPrice(days * priceBooking + price);

        return bookingService.createBooking(booking);
    }

    @GetMapping("/{id}")
    public Booking getBooking(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @RequestBody Booking updatedBooking) {
        return bookingService.updateBooking(id, updatedBooking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }

    @GetMapping("/owner/{ownerId}")
    public List<Booking> getBookingsByOwnerId(@PathVariable Long ownerId) {
        return bookingService.getBookingsByOwnerId(ownerId);
    }

    @GetMapping("/owner/{ownerId}/statistics")
    public SalesStatistics getSalesStatistics(@PathVariable Long ownerId) {
        return bookingService.calculateSalesStatistics(ownerId);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        return bookingService.getBookingsByUserId(userId);
    }

}
