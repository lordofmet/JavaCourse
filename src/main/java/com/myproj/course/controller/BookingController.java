package com.myproj.course.controller;

import com.myproj.course.model.Booking;
import com.myproj.course.model.Property;
import com.myproj.course.model.SalesStatistics;
import com.myproj.course.repository.PropertyRepository;
import com.myproj.course.repository.UserRepository;
import com.myproj.course.service.BookingService;
import com.myproj.course.service.PropertyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

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

        logger.info("Booking created for propertyId: {}", booking.getProperty().getId());
        return bookingService.createBooking(booking);
    }

    @GetMapping("/{id}")
    public Booking getBooking(@PathVariable Long id) {
        logger.info("Getting booking with id: {}", id);
        return bookingService.getBookingById(id);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        logger.info("Fetching all bookings");
        return bookingService.getAllBookings();
    }

    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @RequestBody Booking updatedBooking) {
        logger.info("Updating booking with id: {}", id);
        return bookingService.updateBooking(id, updatedBooking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        logger.info("Deleting booking with id: {}", id);
        bookingService.deleteBooking(id);
    }

    @GetMapping("/owner/{ownerId}")
    public List<Booking> getBookingsByOwnerId(@PathVariable Long ownerId) {
        logger.info("Fetching bookings for ownerId: {}", ownerId);
        return bookingService.getBookingsByOwnerId(ownerId);
    }

    @GetMapping("/owner/{ownerId}/statistics")
    public SalesStatistics getSalesStatistics(@PathVariable Long ownerId) {
        logger.info("Fetching sales statistics for ownerId: {}", ownerId);
        return bookingService.calculateSalesStatistics(ownerId);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        logger.info("Fetching bookings for userId: {}", userId);
        return bookingService.getBookingsByUserId(userId);
    }

}
