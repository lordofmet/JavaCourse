package com.myproj.course.controller;

import com.myproj.course.model.Property;
import com.myproj.course.model.Review;
import com.myproj.course.service.PropertyService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping({"/properties"})
public class PropertyController {
    @Autowired
    private PropertyService propertyService;

    @Autowired
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    public PropertyController() {
    }

    @GetMapping
    public List<Property> getAllProperties() {
        return this.propertyService.getAllProperties();
    }

    @PostMapping
    public Property addProperty(@RequestBody Property property) {
        return this.propertyService.addProperty(property);
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
}
