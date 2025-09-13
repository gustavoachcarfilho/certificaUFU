package com.achcar_solutions.easycomm_core.entities.certificate;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

public record CertificateCreationRequest(
        @Schema(description = "Título ou nome do certificado.", example = "Palestra sobre Microserviços")
        String title,

        @Schema(description = "Categoria do certificado conforme tabela de atividades da UFU.")
        CertificateCategory category,

        @Schema(description = "Carga horária do certificado em horas.", example = "4")
        Integer durationInHours,

        @Schema(description = "Data de expiração do certificado, se aplicável.", example = "2025-12-31")
        LocalDate expirationDate
) {
}
