package com.certificaufu.certifica_ufu_backend.entities.authuser;

public record RegisterDTO(String email, String password, String cpf, String name, UserRole role) {
}
