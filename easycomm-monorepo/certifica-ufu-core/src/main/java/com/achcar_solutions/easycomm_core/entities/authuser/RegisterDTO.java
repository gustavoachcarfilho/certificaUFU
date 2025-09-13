package com.achcar_solutions.easycomm_core.entities.authuser;

import io.swagger.v3.oas.annotations.media.Schema;

public record RegisterDTO(
        @Schema(description = "Endereço de e-mail do novo usuário.", example = "novo.usuario@exemplo.com")
        String email,

        @Schema(description = "Senha para o novo usuário.", example = "senhaForte456")
        String password,

        @Schema(description = "CPF do novo usuário (somente números).", example = "12345678900")
        String cpf,

        @Schema(description = "Nome completo do novo usuário.", example = "Nome Completo do Usuario")
        String name,

        @Schema(description = "Papel do usuário no sistema (ADMIN ou USER).", example = "USER")
        UserRole role) {
}
