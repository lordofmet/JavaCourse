package com.myproj.course.controller;

import com.myproj.course.model.Basket;
import com.myproj.course.service.BasketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/baskets")
public class BasketController {

    private static final Logger logger = LoggerFactory.getLogger(BasketController.class);

    @Autowired
    private final BasketService basketService;

    public BasketController(BasketService basketService) {
        this.basketService = basketService;
    }

    @PostMapping("/{userId}/create")
    public Basket createBasket(@PathVariable Long userId) {
        logger.info("Creating basket for userId: {}", userId);
        return basketService.createBasket(userId);
    }

    @GetMapping("/{userId}")
    public Basket getBasket(@PathVariable Long userId) {
        logger.info("Getting basket for userId: {}", userId);
        return basketService.getOrCreateBasket(userId);
    }

    @PostMapping("/{userId}/add/{bookingId}")
    public Basket addBookingToBasket(@PathVariable Long userId, @PathVariable Long bookingId) {
        logger.info("Adding bookingId: {} to basket of userId: {}", bookingId, userId);
        return basketService.addBookingToBasket(userId, bookingId);
    }

    @DeleteMapping("/{userId}/remove/{bookingId}")
    public Basket removeBookingFromBasket(@PathVariable Long userId, @PathVariable Long bookingId) {
        logger.info("Removing bookingId: {} from basket of userId: {}", bookingId, userId);
        return basketService.removeBookingFromBasket(userId, bookingId);
    }

    @PostMapping("/{userId}/pay")
    public Basket payForBasket(@PathVariable Long userId) {
        logger.info("Processing payment for basket of userId: {}", userId);
        return basketService.payForBasket(userId);
    }

}
