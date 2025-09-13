package com.achcar_solutions.easycomm_core.entities.certificate;

import com.mongodb.lang.Nullable;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "certificates")
@Schema(description = "Representa um certificado e todos os seus metadados no sistema.")
public class Certificate {
    @MongoId(FieldType.OBJECT_ID)
    @Schema(description = "ID único do certificado gerado pelo MongoDB.", example = "60d5f1b3e6b3f1a2b3c4d5e6")
    private String id;

    @CreatedBy
    @Schema(description = "Identificador do usuário que submeteu o certificado.", example = "user@email.com")
    private String createdBy;

    @CreatedDate
    @Schema(description = "Data e hora da criação do registro.")
    private LocalDateTime createdDate;

    @LastModifiedBy
    private String lastModifiedBy;

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;

    @Schema(description = "Título do certificado.", example = "Workshop de Docker e Kubernetes")
    private String title;

    @Schema(description = "Categoria do certificado.")
    private CertificateCategory category;

    @Schema(description = "Carga horária em horas inteiras.", example = "8")
    private Integer durationInHours;

    @Schema(description = "Data de validade do certificado.", example = "2026-01-01")
    private LocalDate expirationDate;

    @Schema(description = "URL permanente para o arquivo na S3 (acesso requer URL pré-assinada).")
    private String fileUrl;

    @Schema(description = "Nome original do arquivo enviado.", example = "certificado_docker.pdf")
    private String fileName;

    @Schema(description = "Tipo MIME do arquivo enviado.", example = "application/pdf")
    private String fileType;

    @Schema(description = "Chave única do objeto no bucket S3.", example = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d.pdf")
    private String s3ObjectKey;

    @Schema(description = "Status atual do processo de validação do certificado.")
    private CertificateStatus status;

    @Nullable
    @Schema(description = "ID do usuário que validou o certificado (se aplicável).")
    private String validator_id;

    @Nullable
    @Schema(description = "Data e hora da validação.")
    private LocalDateTime validationTimestamp;

    @Nullable
    @Schema(description = "Motivo da rejeição, caso o status seja DENIED.")
    private String rejectionReason;
}
