package com.achcar_solutions.easycomm_api.controllers;

import com.achcar_solutions.easycomm_core.entities.certificate.Certificate;
import com.achcar_solutions.easycomm_core.entities.certificate.CertificateCreationRequest;
import com.achcar_solutions.easycomm_api.services.CertificateService;
import com.achcar_solutions.easycomm_core.entities.certificate.CertificateValidationRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("certificate")
@Tag(name = "Certificados", description = "Endpoints para gerenciamento de certificados.")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Operation(summary = "Cria um novo certificado",
            description = "Faz o upload de um arquivo e cria um registro de certificado, que é então enviado para uma fila de processamento assíncrono.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Certificado criado com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Certificate.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida ou certificado duplicado"),
            @ApiResponse(responseCode = "403", description = "Acesso negado - Token JWT inválido ou ausente")
    })
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Certificate> createCertificate(@RequestPart("request") CertificateCreationRequest request,
                                                         @RequestPart("file") MultipartFile file) {
        return new ResponseEntity<Certificate>(certificateService.createCertificate(request, file), HttpStatus.CREATED);
    }

    @Operation(summary = "Busca um certificado por ID", description = "Retorna os detalhes de um certificado específico.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Certificado encontrado",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Certificate.class))),
            @ApiResponse(responseCode = "404", description = "Certificado não encontrado"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Certificate> getCertificateById(@PathVariable String id) {
        return new ResponseEntity<>(certificateService.getCertificateById(id), HttpStatus.OK);
    }

    @Operation(summary = "Lista todos os certificados", description = "Retorna uma lista com todos os certificados cadastrados no sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de certificados retornada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    @GetMapping
    public ResponseEntity<List<Certificate>> getAllCertificates() {
        return new ResponseEntity<List<Certificate>>(certificateService.getAllCertificates(), HttpStatus.OK);
    }

    @Operation(summary = "Deleta um certificado por ID", description = "Remove um certificado e o arquivo associado do sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Certificado deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Certificado não encontrado"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable String id) {
        certificateService.deleteCertificate(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Validates a certificate", description = "Approves or rejects a certificate. Accessible only by ADMIN users.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Certificate validated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid validation request"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Certificate not found")
    })
    @PostMapping("/{id}/validate")
    @PreAuthorize("hasRole('ADMIN')") // This line restricts access to ADMINs
    public ResponseEntity<Certificate> validateCertificate(@PathVariable String id, @RequestBody @Valid CertificateValidationRequest request) {
        Certificate updatedCertificate = certificateService.validateCertificate(id, request);
        return ResponseEntity.ok(updatedCertificate);
    }

    @Operation(summary = "Lists all certificates for the current user", description = "Returns a list of all certificates submitted by the logged-in user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of user's certificates returned successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/my-documents")
    public ResponseEntity<List<Certificate>> getMyCertificates() {
        List<Certificate> certificates = certificateService.findCertificatesByCurrentUser();
        return ResponseEntity.ok(certificates);
    }

    @Operation(summary = "Get a viewable URL for a certificate", description = "Returns a URL to view the certificate file. Accessible only by ADMIN users.")
    @GetMapping("/{id}/view-url")
    public ResponseEntity<Map<String, String>> getCertificateViewUrl(@PathVariable String id) {
        String url = certificateService.generatePresignedUrlForCertificate(id);
        // Retornamos um JSON para ser mais fácil de consumir no frontend
        return ResponseEntity.ok(Map.of("url", url));
    }
}
