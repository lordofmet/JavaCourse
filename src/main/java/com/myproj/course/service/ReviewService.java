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
        // Проверка на наличие пользователя
        if (review.getUser() == null || review.getUser().getId() == null) {
            throw new IllegalArgumentException("User must be provided for the review");
        }

        // Проверка на наличие свойства
        if (review.getProperty() == null || review.getProperty().getId() == null) {
            throw new IllegalArgumentException("Property must be provided for the review");
        }

        // Получение пользователя и свойства из базы данных
        Users user = userRepository.findById(review.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Property property = propertyRepository.findById(review.getProperty().getId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        // Установка связи отзыва с пользователем и свойством
        review.setUser(user);
        review.setProperty(property);

        // Сохранение отзыва в базе данных
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
