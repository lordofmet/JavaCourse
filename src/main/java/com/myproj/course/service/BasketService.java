package com.myproj.course.service;

import com.myproj.course.model.Basket;
import com.myproj.course.model.Booking;
import com.myproj.course.model.Users;
import com.myproj.course.repository.BasketRepository;
import com.myproj.course.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BasketService {

    @Autowired
    private BasketRepository basketRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Basket getOrCreateBasket(Long userId) {
        return basketRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Basket newBasket = new Basket();
                    newBasket.setUser(new Users(userId)); // Создаем новую корзину для пользователя
                    return basketRepository.save(newBasket);
                });
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
