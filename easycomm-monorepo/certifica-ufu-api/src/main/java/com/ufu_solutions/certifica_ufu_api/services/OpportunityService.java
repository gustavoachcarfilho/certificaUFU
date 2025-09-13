package com.ufu_solutions.certifica_ufu_api.services;

import com.achcar_solutions.easycomm_core.entities.opportunity.Opportunity;
import com.achcar_solutions.easycomm_core.entities.opportunity.OpportunityDTO;
import com.achcar_solutions.easycomm_core.entities.opportunity.OpportunityStatus;
import com.achcar_solutions.easycomm_core.repositories.OpportunityRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OpportunityService {
    private final OpportunityRepository opportunityRepository;

    public OpportunityService(OpportunityRepository opportunityRepository) {
        this.opportunityRepository = opportunityRepository;
    }

    public Opportunity create(OpportunityDTO data) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Opportunity opportunity = Opportunity.builder()
                .title(data.title())
                .description(data.description())
                .hours(data.hours())
                .createdBy(username)
                .status(OpportunityStatus.OPEN)
                .applicants(new ArrayList<>())
                .build();
        return opportunityRepository.save(opportunity);
    }

    public List<Opportunity> findAll() {
        return opportunityRepository.findAll();
    }

    public Opportunity findById(String id) {
        return opportunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found with id: " + id));
    }

    public Opportunity update(String id, OpportunityDTO data) {
        Opportunity opportunity = findById(id);
        opportunity.setTitle(data.title());
        opportunity.setDescription(data.description());
        opportunity.setHours(data.hours());
        return opportunityRepository.save(opportunity);
    }

    public void delete(String id) {
        Opportunity opportunity = findById(id);
        opportunityRepository.delete(opportunity);
    }

    public Opportunity addApplicant(String opportunityId) {
        // Find the opportunity by its ID, otherwise throw an exception.
        Opportunity opportunity = findById(opportunityId);

        // Get the email of the authenticated user.
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Check if the user is already an applicant to prevent duplicates.
        if (!opportunity.getApplicants().contains(username)) {
            opportunity.getApplicants().add(username);
            // Save the updated opportunity.
            return opportunityRepository.save(opportunity);
        }

        // Return the unchanged opportunity if the user is already an applicant.
        return opportunity;
    }
}
