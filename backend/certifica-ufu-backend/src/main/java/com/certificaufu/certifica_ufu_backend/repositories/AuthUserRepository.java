package com.certificaufu.certifica_ufu_backend.repositories;

import com.certificaufu.certifica_ufu_backend.entities.authuser.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthUserRepository extends JpaRepository<AuthUser, Long> {
    UserDetails findByEmail(String email);

    AuthUser findByCpf(String cpf);

    Boolean existsByEmail(String email);

    Boolean existsByCpf(String cpf);
}
