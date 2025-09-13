package com.achcar_solutions.easycomm_core.entities.qrcode;

import io.swagger.v3.oas.annotations.media.Schema;

public record QrCodeGenerateResponse(
        @Schema(description = "A URL pública da imagem do QR Code gerado e salvo na S3.")
        String url) {
}
