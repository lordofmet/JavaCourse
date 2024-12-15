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
import static com.myproj.course.model.Role.*;

@Service
public class PropertyService {

    @Autowired
    private final PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Property addProperty(Property property) {
        if (property.getBookingPricePerDay() == 0) {
            throw new IllegalArgumentException("Booking price per day must be greater than zero.");
        }
        return propertyRepository.save(property);
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("no property found"));
    }

    public Property updateProperty(Long id, Property property) {
        Property existingProperty = getPropertyById(id);
        existingProperty.setTitle(property.getTitle());
        existingProperty.setDescription(property.getDescription());
        existingProperty.setPrice(property.getPrice());
        existingProperty.setAmenities(property.getAmenities());
        existingProperty.setType(property.getType());
        existingProperty.setCapacity(property.getCapacity());
        existingProperty.setBookingPricePerDay(property.getBookingPricePerDay());
        return propertyRepository.save(existingProperty);
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    public Property addAmenityToProperty(Long propertyId, String amenity) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setAmenities(amenity + property.getAmenities());
        return propertyRepository.save(property);
    }

    public Property assignOwnerToProperty(Long propertyId, Long ownerId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        Users owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (owner.getRole() == OWNER) {
            property.setOwner(owner);
        }
        return propertyRepository.save(property);
    }

    public Property setPropertyReviews(Long id, Review review) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        Users user = userRepository.findById(review.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        review.setProperty(property);
        review.setUser(user);
        reviewRepository.save(review);
        property.getReviews().add(review);
        return propertyRepository.save(property);
    }

    public List<Property> getPropertiesByOwnerId(Long ownerId) {
        return propertyRepository.findByOwnerId(ownerId);
    }

}
