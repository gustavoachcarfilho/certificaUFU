package com.achcar_solutions.easycomm_core.entities.authuser;

import io.swagger.v3.oas.annotations.media.Schema;

public record AuthenticationDTO(
        @Schema(description = "Endereço de e-mail do usuário.", example = "usuario@exemplo.com")
        String email,

        @Schema(description = "Senha do usuário.", example = "senha123")
        String password) {
}
