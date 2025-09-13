package com.achcar_solutions.easycomm_core.repositories;

import com.achcar_solutions.easycomm_core.entities.opportunity.Opportunity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OpportunityRepository extends MongoRepository<Opportunity, String> {

}