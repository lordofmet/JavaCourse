package com.myproj.course.controller;

import com.myproj.course.model.Basket;
import com.myproj.course.service.BasketService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/baskets")
public class BasketController {

    private final BasketService basketService;

    public BasketController(BasketService basketService) {
        this.basketService = basketService;
    }

    @GetMapping("/{userId}")
    public Basket getBasket(@PathVariable Long userId) {
        return basketService.getOrCreateBasket(userId);
    }

    @PostMapping("/{userId}/add/{bookingId}")
    public Basket addBookingToBasket(@PathVariable Long userId, @PathVariable Long bookingId) {
        return basketService.addBookingToBasket(userId, bookingId);
    }

    @DeleteMapping("/{userId}/remove/{bookingId}")
    public Basket removeBookingFromBasket(@PathVariable Long userId, @PathVariable Long bookingId) {
        return basketService.removeBookingFromBasket(userId, bookingId);
    }

    @PostMapping("/{userId}/pay")
    public Basket payForBasket(@PathVariable Long userId) {
        return basketService.payForBasket(userId);
    }

}
