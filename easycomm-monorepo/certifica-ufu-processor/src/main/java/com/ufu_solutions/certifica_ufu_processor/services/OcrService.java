package com.ufu_solutions.certifica_ufu_processor.services;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class OcrService {

    private static final Logger logger = LoggerFactory.getLogger(OcrService.class);

    /**
     * Extrai texto de um arquivo usando Tesseract OCR via linha de comando.
     * Para PDFs, converte para imagem primeiro usando pdftoppm.
     */
    public String extractTextFromFile(File file) throws IOException {
        logger.info("OCR: Iniciando extração de texto do arquivo: {}", file.getName());
        
        File imageFile = file;
        boolean needsCleanup = false;
        
        try {
            // Se for PDF, converte para PNG primeiro (Tesseract não lê PDF diretamente)
            if (file.getName().toLowerCase().endsWith(".pdf")) {
                logger.info("OCR: Arquivo é PDF, convertendo para PNG...");
                imageFile = convertPdfToImage(file);
                needsCleanup = true;
                logger.info("OCR: PDF convertido para imagem: {}", imageFile.getName());
            }
            
            // Cria arquivo temporário para a saída do Tesseract
            Path outputPath = Files.createTempFile("tesseract-output", ".txt");
            String outputFileWithoutExtension = outputPath.toString().replace(".txt", "");
            
            try {
                // Comando: tesseract input.png output -l por
                ProcessBuilder processBuilder = new ProcessBuilder(
                    "tesseract",
                    imageFile.getAbsolutePath(),
                    outputFileWithoutExtension,
                    "-l", "por"
                );
                
                processBuilder.redirectErrorStream(true);
                Process process = processBuilder.start();
                
                // Captura a saída do processo
                StringBuilder output = new StringBuilder();
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        output.append(line).append("\n");
                    }
                }
                
                int exitCode = process.waitFor();
                
                if (exitCode != 0) {
                    logger.error("OCR: Tesseract falhou com código {}: {}", exitCode, output);
                    throw new IOException("Tesseract OCR falhou com código: " + exitCode);
                }
                
                logger.info("OCR: Tesseract executado com sucesso");
                
                // Lê o arquivo de saída (Tesseract adiciona .txt automaticamente)
                Path finalOutputPath = Path.of(outputFileWithoutExtension + ".txt");
                if (!Files.exists(finalOutputPath)) {
                    throw new IOException("Arquivo de saída do OCR não foi criado");
                }
                
                String extractedText = Files.readString(finalOutputPath, StandardCharsets.UTF_8);
                
                // Remove arquivos temporários
                Files.deleteIfExists(finalOutputPath);
                Files.deleteIfExists(outputPath);
                
                logger.info("OCR: Texto extraído com sucesso ({} caracteres)", extractedText.length());
                return extractedText;
                
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IOException("OCR interrompido", e);
            } finally {
                // Cleanup arquivos temporários do Tesseract
                try {
                    Files.deleteIfExists(Path.of(outputFileWithoutExtension + ".txt"));
                    Files.deleteIfExists(outputPath);
                } catch (IOException ignored) {
                }
            }
            
        } finally {
            // Cleanup arquivo de imagem convertido do PDF
            if (needsCleanup && imageFile != null && imageFile.exists()) {
                boolean deleted = imageFile.delete();
                if (!deleted) {
                    logger.warn("OCR: Falha ao deletar imagem temporária: {}", imageFile.getAbsolutePath());
                }
            }
        }
    }
    
    /**
     * Converte PDF para imagem PNG usando pdftoppm.
     * Converte apenas a primeira página do PDF.
     */
    private File convertPdfToImage(File pdfFile) throws IOException {
        logger.info("OCR: Convertendo PDF para imagem usando pdftoppm...");
        
        // Cria arquivo temporário para a imagem
        Path outputDir = Files.createTempDirectory("pdf-to-image");
        String outputPrefix = outputDir.resolve("page").toString();
        
        try {
            // Comando: pdftoppm -png -f 1 -l 1 -singlefile input.pdf output
            // -png: formato PNG
            // -f 1 -l 1: apenas primeira página
            // -singlefile: gera apenas um arquivo sem sufixo numérico
            ProcessBuilder processBuilder = new ProcessBuilder(
                "pdftoppm",
                "-png",
                "-f", "1",
                "-l", "1",
                "-singlefile",
                pdfFile.getAbsolutePath(),
                outputPrefix
            );
            
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            
            // Captura a saída
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            
            int exitCode = process.waitFor();
            
            if (exitCode != 0) {
                logger.error("OCR: pdftoppm falhou com código {}: {}", exitCode, output);
                throw new IOException("Conversão PDF para imagem falhou com código: " + exitCode);
            }
            
            // O pdftoppm gera arquivo com sufixo .png
            File imageFile = new File(outputPrefix + ".png");
            if (!imageFile.exists()) {
                throw new IOException("Imagem convertida não foi criada: " + imageFile.getAbsolutePath());
            }
            
            logger.info("OCR: PDF convertido com sucesso para: {}", imageFile.getName());
            return imageFile;
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Conversão PDF interrompida", e);
        }
    }
}
