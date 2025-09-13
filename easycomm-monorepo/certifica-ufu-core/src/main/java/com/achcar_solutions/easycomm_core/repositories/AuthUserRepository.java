package com.achcar_solutions.easycomm_core.repositories;

import com.achcar_solutions.easycomm_core.entities.authuser.AuthUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.core.userdetails.UserDetails;


public interface AuthUserRepository extends MongoRepository<AuthUser, String> {
    UserDetails findByEmail(String email);

    AuthUser findByCpf(String cpf);

    Boolean existsByEmail(String email);

    Boolean existsByCpf(String cpf);
}
