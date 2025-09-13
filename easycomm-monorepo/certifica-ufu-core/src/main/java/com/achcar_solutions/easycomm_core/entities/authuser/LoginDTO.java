package com.achcar_solutions.easycomm_core.entities.authuser;

import io.swagger.v3.oas.annotations.media.Schema;

public record LoginDTO(
        @Schema(description = "Token JWT gerado após o login bem-sucedido.", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        String token
) {
}