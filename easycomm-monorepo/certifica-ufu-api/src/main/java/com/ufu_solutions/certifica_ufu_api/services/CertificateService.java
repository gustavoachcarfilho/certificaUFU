package com.ufu_solutions.certifica_ufu_api.services;

import com.achcar_solutions.easycomm_core.entities.certificate.Certificate;
import com.achcar_solutions.easycomm_core.entities.certificate.CertificateCreationRequest;
import com.achcar_solutions.easycomm_core.entities.certificate.CertificateStatus;
import com.achcar_solutions.easycomm_core.entities.certificate.CertificateValidationRequest;
import com.achcar_solutions.easycomm_core.infra.kafka.CertificateKafkaMessage;
import com.ufu_solutions.certifica_ufu_api.infra.kafka.KafkaTopicConfiguration;
import com.achcar_solutions.easycomm_core.infra.ports.StoragePort;
import com.achcar_solutions.easycomm_core.repositories.CertificateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CertificateService {

    private static final Logger logger = LoggerFactory.getLogger(CertificateService.class);
    private final CertificateRepository certificateRepository;
    private final StoragePort storagePort;
    private final KafkaTemplate<String, CertificateKafkaMessage> kafkaTemplate;

    private static final List<String> ALLOWED_FILE_TYPES = List.of("application/pdf", "image/png", "image/jpeg");
    private static final long MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

    public CertificateService(CertificateRepository certificateRepository,
                              StoragePort storagePort,
                              KafkaTemplate<String, CertificateKafkaMessage> kafkaTemplate) {
        this.certificateRepository = certificateRepository;
        this.storagePort = storagePort;
        this.kafkaTemplate = kafkaTemplate;
    }

    public Certificate createCertificate(CertificateCreationRequest request, MultipartFile file) {
        // 1. Pegamos o email do usuário logado diretamente do contexto de segurança.
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        logger.info("Received request to create certificate '{}' for user '{}'", request.title(), currentUserEmail);

        // 2. Usamos o email do usuário logado para a verificação de duplicidade.
        var maybeExistentCertificate = certificateRepository.findByCreatedByAndTitleAndCategory(currentUserEmail, request.title(), request.category());
        if (maybeExistentCertificate.isPresent()) {
            logger.warn("Certificate creation blocked: A certificate with the same title and category already exists for this user.");
            throw new RuntimeException("Certificate already exists for the given user, title, and category.");
        }

        validateCertificate(file);
        logger.info("File validation successful.");

        try {
            String originalFileName = file.getOriginalFilename();
            assert originalFileName != null;
            String fileType = originalFileName.substring(originalFileName.lastIndexOf("."));
            String s3ObjectKey = UUID.randomUUID() + fileType;

            logger.info("Uploading file to S3 storage...");
            String fileUrl = storagePort.uploadFile(file.getBytes(), s3ObjectKey, fileType);
            logger.info("File uploaded successfully. URL: {}", fileUrl);

            Certificate certificate = Certificate.builder()
                    // 3. DEFINIMOS MANUALMENTE o createdBy com o usuário que pegamos do token.
                    .createdBy(currentUserEmail)
                    .createdDate(LocalDateTime.now())
                    .title(request.title())
                    .category(request.category())
                    .durationInHours(request.durationInHours())
                    .expirationDate(request.expirationDate())
                    .fileUrl(fileUrl)
                    .fileName(originalFileName)
                    .fileType(fileType)
                    .s3ObjectKey(s3ObjectKey)
                    .status(CertificateStatus.PENDING)
                    .build();

            logger.info("Saving certificate metadata to the database...");
            // Usamos .save() que é a prática recomendada.
            Certificate savedCertificate = certificateRepository.save(certificate);
            logger.info("Certificate metadata saved with ID: {}", savedCertificate.getId());

            CertificateKafkaMessage kafkaMessage = new CertificateKafkaMessage(savedCertificate.getId(), savedCertificate.getS3ObjectKey());
            kafkaTemplate.send(KafkaTopicConfiguration.CERTIFICATE_TOPIC, kafkaMessage);
            logger.info("Message successfully sent to Kafka.");

            return savedCertificate;

        } catch (IOException exception) {
            logger.error("Error reading file bytes during upload", exception);
            throw new RuntimeException("Error uploading file to storage: " + exception.getMessage(), exception);
        }
    }

    public List<Certificate> getAllCertificates() {
        logger.info("Request received to get all certificates.");
        return certificateRepository.findAll();
    }

    public Certificate getCertificateById(String id) {
        logger.info("Request received to get certificate by ID: {}", id);
        return certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + id));
    }

    public void deleteCertificate(String id) {
        logger.info("Request received to delete certificate by ID: {}", id);
        Certificate certificate = getCertificateById(id);

        logger.info("Deleting file from S3 with key: {}", certificate.getS3ObjectKey());
        storagePort.deleteFile(certificate.getS3ObjectKey());
        logger.info("File successfully deleted from S3.");

        certificateRepository.delete(certificate);
        logger.info("Certificate with id: {} successfully deleted from database.", id);
    }

    private void validateCertificate(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("O arquivo não pode estar vazio.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("O arquivo excede o tamanho máximo de 5 MB.");
        }

        if (!ALLOWED_FILE_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Tipo de arquivo inválido. Apenas PDFs e imagens (PNG/JPG) são permitidos.");
        }
    }

    public Certificate validateCertificate(String id, CertificateValidationRequest request) {
        // Find the certificate or throw an exception if not found.
        Certificate certificate = getCertificateById(id);

        // Get the email of the admin performing the validation.
        String validatorId = SecurityContextHolder.getContext().getAuthentication().getName();

        // Validate the request data.
        if (request.status() == CertificateStatus.DENIED && (request.rejectionReason() == null || request.rejectionReason().isBlank())) {
            throw new IllegalArgumentException("Rejection reason is mandatory when denying a certificate.");
        }

        // Update the certificate fields.
        certificate.setStatus(request.status());
        certificate.setValidator_id(validatorId);
        certificate.setValidationTimestamp(LocalDateTime.now());
        certificate.setLastModifiedDate(LocalDateTime.now());
        certificate.setLastModifiedBy(validatorId);

        if (request.status() == CertificateStatus.DENIED) {
            certificate.setRejectionReason(request.rejectionReason());
        } else {
            certificate.setRejectionReason(null); // Clear reason on approval
        }

        // Save the updated certificate to the database.
        return certificateRepository.save(certificate);
    }

    public List<Certificate> findCertificatesByCurrentUser() {
        // Get the email of the logged-in user from the security context.
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Fetching certificates for user: {}", username);
        // Use the repository to find all certificates created by this user.
        return certificateRepository.findAllByCreatedBy(username);
    }

    public String generatePresignedUrlForCertificate(String id) {
        logger.info("Request received to generate pre-signed URL for certificate ID: {}", id);
        Certificate certificate = getCertificateById(id);

        // O S3StorageAdapter já tem o método para gerar a URL, vamos apenas chamá-lo.
        // O ideal seria ter um método específico para isso no StoragePort, mas para agilizar,
        // vamos assumir que o adapter pode ser acessado aqui ou que o uploadFile retorna uma URL acessível.
        // Para um acesso seguro real, precisaríamos de um método que gere uma URL pré-assinada.
        return certificate.getFileUrl();
    }
}
