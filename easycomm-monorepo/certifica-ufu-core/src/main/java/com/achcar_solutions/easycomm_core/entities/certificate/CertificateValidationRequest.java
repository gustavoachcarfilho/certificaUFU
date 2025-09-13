package com.achcar_solutions.easycomm_core.entities.certificate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record CertificateValidationRequest(
        @Schema(description = "The new status for the certificate (APPROVED or DENIED).", example = "APPROVED")
        @NotNull(message = "Status is required.")
        CertificateStatus status,

        @Schema(description = "Reason for rejection (required if status is DENIED).", example = "O documento não contém a data de emissão.")
        String rejectionReason
) {
}
