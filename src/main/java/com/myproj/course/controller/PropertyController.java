package com.myproj.course.controller;

import com.myproj.course.model.Property;
import com.myproj.course.model.Review;
import com.myproj.course.model.Users;
import com.myproj.course.service.PropertyService;

import java.util.List;

import com.myproj.course.service.ReviewService;
import com.myproj.course.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping({"/properties"})
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private UserService userService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    public PropertyController() {

    }

    @GetMapping
    public List<Property> getProperties() {
        return reviewService.getAllPropertiesWithAverageRatings();
    }

    @PostMapping
    public ResponseEntity<Property> addProperty(@RequestBody Property property) {
        // Получаем пользователя по ID
        Users owner = userService.getUserById(property.getOwner().getId());

        // Устанавливаем владельца
        property.setOwner(owner);

        if (property.getBookingPricePerDay() == 0) {
            throw new IllegalArgumentException("Booking price per day must be greater than zero.");
        }

        Property savedProperty = propertyService.addProperty(property);
        return ResponseEntity.ok(savedProperty);
    }


    @GetMapping({"/{id}"})
    public Property getPropertyById(@PathVariable Long id) {
        return this.propertyService.getPropertyById(id);
    }

    @PutMapping({"/{id}"})
    public Property updateProperty(@PathVariable Long id, @RequestBody Property property) {
        return this.propertyService.updateProperty(id, property);
    }

    @DeleteMapping({"/{id}"})
    public void deleteProperty(@PathVariable Long id) {
        this.propertyService.deleteProperty(id);
    }

    @PostMapping({"/{id}/add-amenity"})
    public Property addAmenityToProperty(@PathVariable Long id, @RequestBody String amenity) {
        return this.propertyService.addAmenityToProperty(id, amenity);
    }

    @PostMapping({"/{id}/assign-owner"})
    public Property assignOwnerToProperty(@PathVariable Long id, @RequestBody Long ownerId) {
        return this.propertyService.assignOwnerToProperty(id, ownerId);
    }

    @PostMapping({"/{id}/reviews"})
    public Property setPropertyReviews(@PathVariable Long id, @RequestBody Review review) {
        return this.propertyService.setPropertyReviews(id, review);
    }

    @GetMapping("/owner/{ownerId}")
    public List<Property> getPropertiesByOwner(@PathVariable Long ownerId) {
        List<Property> properties = reviewService.getAllPropertiesWithAverageRatings(ownerId);

        for (Property property : properties) {
            List<Review> reviews = reviewService.getReviewsByPropertyId(property.getId());
            property.setReviews(reviews);
        }

        return properties;
    }
}
