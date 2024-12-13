package com.myproj.course.service;

import com.myproj.course.model.Property;
import com.myproj.course.model.Review;
import com.myproj.course.model.Users;
import com.myproj.course.repository.PropertyRepository;
import com.myproj.course.repository.ReviewRepository;
import com.myproj.course.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private final ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review addReview(Review review) {
        if (review.getProperty() == null) {
            throw new RuntimeException("Property must be provided");
        }

        Property property = propertyRepository.findById(review.getProperty().getId())
                .orElseThrow(() -> new RuntimeException("Property not found"));
        review.setProperty(property);
        return reviewRepository.save(review);
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Review not found"));
    }

    public Review updateReview(Long id, Review review) {
        Review existingReview = getReviewById(id);
        existingReview.setComment(review.getComment());
        existingReview.setRating(review.getRating());
        existingReview.setUser(review.getUser());
        existingReview.setProperty(review.getProperty());
        return reviewRepository.save(existingReview);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    public Review assignUserToReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        review.setUser(user);
        return reviewRepository.save(review);
    }

    public Review assignPropertyToReview(Long reviewId, Long propertyId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        review.setProperty(property);
        return reviewRepository.save(review);
    }

}
