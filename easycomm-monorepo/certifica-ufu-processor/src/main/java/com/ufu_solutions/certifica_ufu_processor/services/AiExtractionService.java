package com.ufu_solutions.certifica_ufu_processor.services;

import com.achcar_solutions.easycomm_core.entities.certificate.Certificate;
import com.achcar_solutions.easycomm_core.infra.kafka.CertificateKafkaMessage;
import com.achcar_solutions.easycomm_core.repositories.CertificateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AiExtractionService {

    private static final Logger logger = LoggerFactory.getLogger(AiExtractionService.class);
    private final CertificateRepository certificateRepository;
    private final GeminiService geminiService;

    public AiExtractionService(CertificateRepository certificateRepository, GeminiService geminiService) {
        this.certificateRepository = certificateRepository;
        this.geminiService = geminiService;
    }

    @KafkaListener(topics = "certificates-ocr-completed", groupId = "ai-extraction-processor")
    public void processWithAi(CertificateKafkaMessage kafkaMessage) {
        logger.info("==============================================");
        logger.info("PROCESSADOR IA: Mensagem recebida do OCR!");
        logger.info("--> ID do Certificado: {}", kafkaMessage.certificateId());

        certificateRepository.findById(kafkaMessage.certificateId()).ifPresentOrElse(
                certificate -> {
                    try {
                        // Verificar se é imagem ou PDF
                        boolean isImage = certificate.getFileType() != null && 
                            (certificate.getFileType().contains("png") || certificate.getFileType().contains("jpeg") || certificate.getFileType().contains("jpg"));

                        Map<String, Object> aiResponse;

                        if (isImage) {
                            // Processar imagem via URL
                            if (certificate.getFileUrl() == null || certificate.getFileUrl().isEmpty()) {
                                logger.error("ERRO: URL do arquivo não encontrada para o certificado de imagem {}", certificate.getId());
                                certificate.setAiErrorMessage("URL do arquivo não disponível");
                                certificate.setAiProcessedAt(LocalDateTime.now());
                                certificateRepository.save(certificate);
                                return;
                            }

                            logger.info("📷 Processando imagem via URL. Enviando para IA...");
                            aiResponse = geminiService.extractCertificateDataFromImage(certificate.getFileUrl());

                        } else {
                            // Processar PDF via texto OCR
                            if (certificate.getOcrRawText() == null || certificate.getOcrRawText().isEmpty()) {
                                logger.error("ERRO: Texto OCR não encontrado para o certificado {}", certificate.getId());
                                certificate.setAiErrorMessage("Texto OCR não disponível para processamento");
                                certificate.setAiProcessedAt(LocalDateTime.now());
                                certificateRepository.save(certificate);
                                return;
                            }

                            logger.info("Texto OCR disponível ({} caracteres). Enviando para IA...", 
                                certificate.getOcrRawText().length());
                            aiResponse = geminiService.extractCertificateData(certificate.getOcrRawText());
                        }

                        // Verificar se houve erro
                        if (aiResponse.containsKey("error")) {
                            String errorMessage = (String) aiResponse.get("error");
                            logger.error("Erro na extração pela IA: {}", errorMessage);
                            certificate.setAiErrorMessage(errorMessage);
                            certificate.setAiProcessedAt(LocalDateTime.now());
                            certificateRepository.save(certificate);
                            return;
                        }

                        // Extrair campos retornados pela IA
                        String participantName = (String) aiResponse.get("participantName");
                        String institution = (String) aiResponse.get("institution");
                        String eventDate = (String) aiResponse.get("eventDate");
                        Integer aiWorkload = aiResponse.get("workload") != null ? 
                            ((Number) aiResponse.get("workload")).intValue() : null;
                        Double confidence = aiResponse.get("confidence") != null ?
                            ((Number) aiResponse.get("confidence")).doubleValue() : 0.0;

                        logger.info("IA extraiu: Nome={}, Instituição={}, Data={}, Carga Horária={}, Confiança={}", 
                            participantName, institution, eventDate, aiWorkload, confidence);

                        // Verificar divergência de carga horária (>20%)
                        Boolean workloadMismatch = false;
                        if (aiWorkload != null && certificate.getDurationInHours() != null && certificate.getDurationInHours() > 0) {
                            int userWorkload = certificate.getDurationInHours();
                            double divergence = Math.abs(aiWorkload - userWorkload) / (double) userWorkload;
                            workloadMismatch = divergence > 0.20; // 20% de divergência
                            
                            if (workloadMismatch) {
                                logger.warn("⚠️ ALERTA: Divergência de carga horária detectada! " +
                                    "Usuário informou: {}h, IA detectou: {}h ({}% diferença)", 
                                    userWorkload, aiWorkload, Math.round(divergence * 100));
                            }
                        }

                        // Atualizar certificado com dados extraídos
                        certificate.setAiParticipantName(participantName);
                        certificate.setAiInstitution(institution);
                        certificate.setAiEventDate(eventDate);
                        certificate.setAiDetectedWorkload(aiWorkload);
                        certificate.setAiWorkloadMismatch(workloadMismatch);
                        certificate.setAiConfidenceScore(confidence);
                        certificate.setAiProcessedAt(LocalDateTime.now());
                        certificate.setAiErrorMessage(null); // Limpar erros anteriores
                        
                        certificateRepository.save(certificate);

                        logger.info("✅ Certificado processado pela IA com sucesso!");

                    } catch (Exception e) {
                        logger.error("❌ ERRO ao processar com IA o certificado {}: {}", 
                            certificate.getId(), e.getMessage(), e);
                        certificate.setAiErrorMessage("Erro inesperado: " + e.getMessage());
                        certificate.setAiProcessedAt(LocalDateTime.now());
                        certificateRepository.save(certificate);
                    }
                },
                () -> logger.error("❌ FALHA: Certificado com ID {} não encontrado.", kafkaMessage.certificateId())
        );
        logger.info("==============================================");
    }
}
