package com.ufu_solutions.certifica_ufu_processor.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Extrai dados estruturados do texto OCR usando Gemini AI
     */
    public Map<String, Object> extractCertificateData(String ocrText) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
            
            String prompt = """
                Extraia os dados deste certificado e retorne APENAS um JSON válido:
                
                {
                  "participantName": "nome do participante ou null",
                  "institution": "instituição emissora ou null",
                  "eventDate": "data no formato YYYY-MM-DD ou null",
                  "workload": número de horas (integer) ou null,
                  "confidence": 0.0 a 1.0
                }
                
                Texto do certificado:
                %s
                """.formatted(ocrText);

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                ),
                "generationConfig", Map.of(
                    "temperature", 0.1,
                    "topK", 1,
                    "topP", 0.1,
                    "maxOutputTokens", 2048,
                    "responseMimeType", "application/json"
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            logger.info("Enviando texto OCR para Gemini AI (tamanho: {} caracteres)...", ocrText.length());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            
            logger.info("Resposta recebida do Gemini: " + response.getBody());
            
            // Parse da resposta
            JsonNode root = objectMapper.readTree(response.getBody());
            
            // Verificar se há candidatos na resposta
            if (!root.has("candidates") || root.path("candidates").isEmpty()) {
                logger.error("Resposta do Gemini não contém candidates");
                throw new RuntimeException("Resposta inválida da API Gemini");
            }
            
            String textResponse = root.path("candidates").get(0)
                                     .path("content").path("parts").get(0)
                                     .path("text").asText();
            
            if (textResponse == null || textResponse.isEmpty()) {
                logger.error("Resposta de texto vazia do Gemini");
                throw new RuntimeException("Resposta vazia da API Gemini");
            }
            
            logger.info("Texto bruto da IA recebido (tamanho: {} caracteres)", textResponse.length());
            
            // Extrair JSON da resposta (remover markdown se houver)
            String jsonText = textResponse.replaceAll("```json\\n?", "").replaceAll("```\\n?", "").trim();
            
            logger.info("JSON após limpeza (tamanho: {} caracteres)", jsonText.length());
            
            // Validar se parece um JSON válido
            if (!jsonText.startsWith("{") || !jsonText.endsWith("}")) {
                logger.error("Texto extraído não parece ser um JSON válido. Início: {}, Fim: {}", 
                    jsonText.substring(0, Math.min(50, jsonText.length())),
                    jsonText.substring(Math.max(0, jsonText.length() - 50)));
                throw new RuntimeException("Formato de resposta inválido");
            }
            
            Map<String, Object> extractedData = objectMapper.readValue(jsonText, Map.class);
            
            // Validar se todos os campos esperados estão presentes
            if (!extractedData.containsKey("participantName") || 
                !extractedData.containsKey("institution") ||
                !extractedData.containsKey("workload") ||
                !extractedData.containsKey("confidence")) {
                logger.warn("Resposta da IA não contém todos os campos esperados");
            }
            
            return extractedData;
            
        } catch (Exception e) {
            logger.error("Erro ao chamar Gemini API: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("confidence", 0.0);
            return errorResponse;
        }
    }

    /**
     * Extrai dados estruturados de uma imagem de certificado usando Gemini AI
     */
    public Map<String, Object> extractCertificateDataFromImage(String imageUrl) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
            
            String prompt = """
                Extraia os dados deste certificado e retorne APENAS um JSON válido:
                
                {
                  "participantName": "nome do participante ou null",
                  "institution": "instituição emissora ou null",
                  "eventDate": "data no formato YYYY-MM-DD ou null",
                  "workload": número de horas (integer) ou null,
                  "confidence": 0.0 a 1.0
                }
                """;

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt),
                        Map.of("fileData", Map.of(
                            "mimeType", "image/jpeg",
                            "fileUri", imageUrl
                        ))
                    ))
                ),
                "generationConfig", Map.of(
                    "temperature", 0.1,
                    "topK", 1,
                    "topP", 0.1,
                    "maxOutputTokens", 1024,
                    "responseMimeType", "application/json"
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            logger.info("Enviando URL da imagem para Gemini AI: {}", imageUrl);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            
            logger.info("Resposta recebida do Gemini para imagem");
            
            // Parse da resposta
            JsonNode root = objectMapper.readTree(response.getBody());
            
            // Verificar se há candidatos na resposta
            if (!root.has("candidates") || root.path("candidates").isEmpty()) {
                logger.error("Resposta do Gemini não contém candidates");
                throw new RuntimeException("Resposta inválida da API Gemini");
            }
            
            String textResponse = root.path("candidates").get(0)
                                     .path("content").path("parts").get(0)
                                     .path("text").asText();
            
            if (textResponse == null || textResponse.isEmpty()) {
                logger.error("Resposta de texto vazia do Gemini");
                throw new RuntimeException("Resposta vazia da API Gemini");
            }
            
            logger.info("Texto bruto da IA recebido para imagem (tamanho: {} caracteres)", textResponse.length());
            
            // Extrair JSON da resposta (remover markdown se houver)
            String jsonText = textResponse.replaceAll("```json\\n?", "").replaceAll("```\\n?", "").trim();
            
            logger.info("JSON após limpeza (tamanho: {} caracteres)", jsonText.length());
            
            // Validar se parece um JSON válido
            if (!jsonText.startsWith("{") || !jsonText.endsWith("}")) {
                logger.error("Texto extraído não parece ser um JSON válido. Início: {}, Fim: {}", 
                    jsonText.substring(0, Math.min(50, jsonText.length())),
                    jsonText.substring(Math.max(0, jsonText.length() - 50)));
                throw new RuntimeException("Formato de resposta inválido");
            }
            
            Map<String, Object> extractedData = objectMapper.readValue(jsonText, Map.class);
            
            // Validar se todos os campos esperados estão presentes
            if (!extractedData.containsKey("participantName") || 
                !extractedData.containsKey("institution") ||
                !extractedData.containsKey("workload") ||
                !extractedData.containsKey("confidence")) {
                logger.warn("Resposta da IA não contém todos os campos esperados");
            }
            
            return extractedData;
            
        } catch (Exception e) {
            logger.error("Erro ao chamar Gemini API para imagem: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("confidence", 0.0);
            return errorResponse;
        }
    }
}
