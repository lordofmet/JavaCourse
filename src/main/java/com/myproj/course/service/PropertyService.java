package com.myproj.course.service;

import com.myproj.course.model.Property;
import com.myproj.course.model.Review;
import com.myproj.course.model.Users;
import com.myproj.course.repository.PropertyRepository;
import com.myproj.course.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.myproj.course.model.Role.OWNER;
import static com.myproj.course.model.Role.TENANT;

@Service
public class PropertyService {

    @Autowired
    private final PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Property addProperty(Property property) {
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
        existingProperty.setOwner(property.getOwner());
        existingProperty.setReviews(property.getReviews());
        return propertyRepository.save(existingProperty);
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    public Property addAmenityToProperty(Long propertyId, String amenity) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        property.getAmenities().add(amenity);
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
        property.getReviews().add(review);
        return propertyRepository.save(property);
    }

}
