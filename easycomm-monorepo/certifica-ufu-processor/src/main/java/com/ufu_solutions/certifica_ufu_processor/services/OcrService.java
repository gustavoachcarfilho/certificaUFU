package com.ufu_solutions.certifica_ufu_processor.services;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class OcrService {

    private static final Logger logger = LoggerFactory.getLogger(OcrService.class);

    public String extractTextFromFile(File file) throws TesseractException {
        ITesseract tesseract = new Tesseract();
        tesseract.setLanguage("por");

        String windowsTessDataPath = "C:/Program Files/Tesseract-OCR/tessdata";
        Path tessDataPath = Paths.get(windowsTessDataPath);

        if (Files.exists(tessDataPath)) {
            logger.info("OCR: Pasta 'tessdata' encontrada em: {}", windowsTessDataPath);
            tesseract.setDatapath(windowsTessDataPath);
        } else {
            logger.warn("OCR: Instalação Windows não encontrada. Usando padrão Linux.");
            tesseract.setDatapath("/usr/share/tesseract-ocr/4.00/tessdata");
        }

        return tesseract.doOCR(file);
    }
}
