package com.myproj.course.service;

import com.myproj.course.model.Booking;
import com.myproj.course.model.Property;
import com.myproj.course.repository.BookingRepository;
import com.myproj.course.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}
