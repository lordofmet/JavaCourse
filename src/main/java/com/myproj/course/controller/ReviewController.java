package com.myproj.course.controller;

import com.myproj.course.model.Review;
import com.myproj.course.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    public ReviewController() {

    }

    @GetMapping
    public List<Review> getAllReviews() {
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
        return reviewService.addReview(review);
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable Long id) {
        return reviewService.getReviewById(id);
    }

    @PutMapping("/{id}")
    public Review updateReview(@PathVariable Long id, @RequestBody Review review) {
        return reviewService.updateReview(id, review);
    }

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
    }

    @PostMapping("/{id}/reviews")
    public Review addReview(@PathVariable Long id, @RequestBody Review review) {
        return reviewService.addReview(review);
    }

    @PostMapping("/{id}/assign-user")
    public Review assignUserToReview(@PathVariable Long id, @RequestBody Long userId) {
        return reviewService.assignUserToReview(id, userId);
    }

    @PostMapping("/{id}/assign-property")
    public Review assignPropertyToReview(@PathVariable Long id, @RequestBody Long propertyId) {
        return reviewService.assignPropertyToReview(id, propertyId);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<?> getReviewsByProperty(@PathVariable Long propertyId) {
        List<Review> reviews = reviewService.getReviewsByPropertyId(propertyId);
        if (reviews.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(reviews);
    }

}
