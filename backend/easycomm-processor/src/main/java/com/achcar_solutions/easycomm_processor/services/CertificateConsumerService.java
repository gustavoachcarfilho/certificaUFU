package com.achcar_solutions.easycomm_processor.services;

import com.achcar_solutions.easycomm_core.entities.certificate.CertificateStatus;
import com.achcar_solutions.easycomm_core.infra.kafka.CertificateKafkaMessage;
import com.achcar_solutions.easycomm_core.infra.ports.StoragePort;
import com.achcar_solutions.easycomm_core.repositories.CertificateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class CertificateConsumerService {

    private static final Logger logger = LoggerFactory.getLogger(CertificateConsumerService.class);
    private final CertificateRepository certificateRepository;
    private final StoragePort storagePort;

    public CertificateConsumerService(CertificateRepository certificateRepository, StoragePort storagePort) {
        this.certificateRepository = certificateRepository;
        this.storagePort = storagePort;
    }

    @KafkaListener(topics = "certificates-to-process", groupId = "certificate-processor")
    public void consumeCertificate(CertificateKafkaMessage kafkaMessage) {
        logger.info("==============================================");
        logger.info("PROCESSADOR: Mensagem recebida! Iniciando processamento...");
        logger.info("--> ID do Certificado: {}", kafkaMessage.certificateId());
        logger.info("--> Chave do Objeto S3: {}", kafkaMessage.s3ObjectKey());

        certificateRepository.findById(kafkaMessage.certificateId()).ifPresentOrElse(
                certificate -> {
                    try {
                        logger.info("Certificado '{}' encontrado no banco. Status atual: {}.", certificate.getTitle(), certificate.getStatus());

                        logger.info("Baixando arquivo da S3...");
                        byte[] fileData = storagePort.downloadFile(kafkaMessage.s3ObjectKey());
                        logger.info("Arquivo baixado com sucesso (Tamanho: {} bytes).", fileData.length);

                        logger.info("Simulando validação de OCR...");
                        boolean ocrSimulation = true;
                        if(ocrSimulation) {
                            certificate.setStatus(CertificateStatus.PENDING);
                            logger.info("Validação realizada com sucesso! Status do certificado alterado para APPROVED.");
                        } else {
                            certificate.setStatus(CertificateStatus.DENIED);
                            logger.warn("Validação falhou. Status do certificado alterado para DENIED.");
                        }
                        certificateRepository.save(certificate);
                        logger.info("Certificado salvo no banco de dados com sucesso!");
                    } catch (Exception e) {
                        System.out.println("Error while processing certificate: " + e.getMessage());
                        logger.error("ERRO CRÍTICO ao processar o certificado ID {}: {}", certificate.getId(), e.getMessage(), e);
                    }
                },
                () -> logger.error("FALHA: Certificado com ID {} não foi encontrado no banco de dados.", kafkaMessage.certificateId())
        );
        logger.info("==============================================");
    }
}
