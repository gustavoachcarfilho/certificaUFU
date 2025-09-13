package com.achcar_solutions.easycomm_core.entities.qrcode;

import io.swagger.v3.oas.annotations.media.Schema;

public record QrCodeGenerateRequest(
        @Schema(description = "O texto ou URL que será encodado no QR Code.", example = "https://www.linkedin.com/in/gustavo-achcar-filho/")
        String text
) {
}
