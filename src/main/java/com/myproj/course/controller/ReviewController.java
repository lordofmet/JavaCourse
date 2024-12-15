package com.myproj.course.controller;

import com.myproj.course.model.Review;
import com.myproj.course.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    private ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    public ReviewController() {

    }

    @GetMapping
    public List<Review> getAllReviews() {
        logger.info("Getting all reviews.");
        List<Review> reviews = reviewService.getAllReviews();
        for (Review review : reviews) {
            if (review.getUser() != null) {
                review.getUser().setFullName(review.getUser().getFullName());
            }
        }
        return reviews;
    }

    @PostMapping
    public Review addReview(@RequestBody Review review) {
        logger.info("Adding a new review: {}", review);
        return reviewService.addReview(review);
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable Long id) {
        logger.info("Getting review with ID: {}", id);
        return reviewService.getReviewById(id);
    }

    @PutMapping("/{id}")
    public Review updateReview(@PathVariable Long id, @RequestBody Review review) {
        logger.info("Updating review with ID: {}", id);
        return reviewService.updateReview(id, review);
    }

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        logger.info("Deleting review with ID: {}", id);
        reviewService.deleteReview(id);
    }

    @PostMapping("/{id}/reviews")
    public Review addReview(@PathVariable Long id, @RequestBody Review review) {
        logger.info("Adding review for review ID: {}", id);
        return reviewService.addReview(review);
    }

    @PostMapping("/{id}/assign-user")
    public Review assignUserToReview(@PathVariable Long id, @RequestBody Long userId) {
        logger.info("Assigning user with ID: {} to review with ID: {}", userId, id);
        return reviewService.assignUserToReview(id, userId);
    }

    @PostMapping("/{id}/assign-property")
    public Review assignPropertyToReview(@PathVariable Long id, @RequestBody Long propertyId) {
        logger.info("Assigning property with ID: {} to review with ID: {}", propertyId, id);
        return reviewService.assignPropertyToReview(id, propertyId);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<?> getReviewsByProperty(@PathVariable Long propertyId) {
        logger.info("Getting reviews for property with ID: {}", propertyId);
        List<Review> reviews = reviewService.getReviewsByPropertyId(propertyId);
        if (reviews.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(reviews);
    }

}
