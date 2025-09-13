package com.achcar_solutions.easycomm_api.controllers;


import com.achcar_solutions.easycomm_core.entities.qrcode.QrCodeGenerateRequest;
import com.achcar_solutions.easycomm_core.entities.qrcode.QrCodeGenerateResponse;
import com.achcar_solutions.easycomm_api.services.QrCodeGeneratorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("qrcode")
@Tag(name = "QR Code", description = "Endpoints para geração de QR Codes.")
public class QrCodeController {

    private final QrCodeGeneratorService qrCodeGeneratorService;

    public QrCodeController(QrCodeGeneratorService qrCodeGeneratorService) {
        this.qrCodeGeneratorService = qrCodeGeneratorService;
    }

    @Operation(summary = "Gera um QR Code a partir de um texto",
            description = "Recebe um texto/URL, gera uma imagem de QR Code correspondente e a salva na S3, retornando a URL pública da imagem.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "QR Code gerado com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = QrCodeGenerateResponse.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado - Token JWT inválido ou ausente"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor durante a geração ou upload do QR Code")
    })
    @PostMapping
    public ResponseEntity<QrCodeGenerateResponse> generate(@RequestBody QrCodeGenerateRequest request){
        try {
            QrCodeGenerateResponse qrCodeGenerateResponse = this.qrCodeGeneratorService.generateAndUploadQrCode(request.text());
            return ResponseEntity.ok(qrCodeGenerateResponse);
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.internalServerError().build();
        }

    }
}
