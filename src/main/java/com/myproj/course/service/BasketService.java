package com.myproj.course.service;

import com.myproj.course.model.Basket;
import com.myproj.course.model.Booking;
import com.myproj.course.model.Users;
import com.myproj.course.repository.BasketRepository;
import com.myproj.course.repository.BookingRepository;
import com.myproj.course.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Service
public class BasketService {

    @Autowired
    private BasketRepository basketRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    public Basket createBasket(Long userId) {
        // Check if the user exists
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create a new basket
        Basket basket = new Basket();
        basket.setUser(user);
        // Initialize any other properties of the basket if necessary (e.g., status, date created)

        // Save the new basket to the repository
        return basketRepository.save(basket);
    }

    public Basket getOrCreateBasket(Long userId) {
        return basketRepository.findByUserId(userId)
                .orElseGet(() -> createBasket(userId));
    }

    public Basket addBookingToBasket(Long userId, Long bookingId) {
        Basket basket = getOrCreateBasket(userId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setBasket(basket);
        bookingRepository.save(booking);

        basket.getBookings().add(booking);
        return basketRepository.save(basket);
    }

    public Basket removeBookingFromBasket(Long userId, Long bookingId) {
        Basket basket = getOrCreateBasket(userId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!basket.getBookings().contains(booking)) {
            throw new RuntimeException("Booking is not in the basket");
        }

        booking.setBasket(null);
        bookingRepository.delete(booking);

        basket.getBookings().remove(booking);
        return basketRepository.save(basket);
    }

    public Basket payForBasket(Long userId) {
        Basket basket = getOrCreateBasket(userId);

        basket.getBookings().forEach(booking -> {
            booking.setStatus("Paid");
            bookingRepository.save(booking);
        });

        return basket;
    }

}
