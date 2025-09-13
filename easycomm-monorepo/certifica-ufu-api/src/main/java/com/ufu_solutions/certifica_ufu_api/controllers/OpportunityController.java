package com.ufu_solutions.certifica_ufu_api.controllers;

import com.ufu_solutions.certifica_ufu_api.services.OpportunityService;
import com.achcar_solutions.easycomm_core.entities.opportunity.Opportunity;
import com.achcar_solutions.easycomm_core.entities.opportunity.OpportunityDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("opportunity")
@Tag(name = "Oportunidades", description = "Endpoints para gerenciamento de oportunidades de horas complementares.")
public class OpportunityController {

    @Autowired
    private OpportunityService opportunityService;

    @PostMapping
    public ResponseEntity<Opportunity> create(@RequestBody @Valid OpportunityDTO data) {
        Opportunity createdOpportunity = opportunityService.create(data);
        return new ResponseEntity<>(createdOpportunity, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Opportunity>> getAll() {
        List<Opportunity> opportunities = opportunityService.findAll();
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Opportunity> getById(@PathVariable String id) {
        Opportunity opportunity = opportunityService.findById(id);
        return ResponseEntity.ok(opportunity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Opportunity> update(@PathVariable String id, @RequestBody @Valid OpportunityDTO data) {
        Opportunity updatedOpportunity = opportunityService.update(id, data);
        return ResponseEntity.ok(updatedOpportunity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        opportunityService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<Opportunity> applyToOpportunity(@PathVariable String id) {
        Opportunity updatedOpportunity = opportunityService.addApplicant(id);
        return ResponseEntity.ok(updatedOpportunity);
    }
}
