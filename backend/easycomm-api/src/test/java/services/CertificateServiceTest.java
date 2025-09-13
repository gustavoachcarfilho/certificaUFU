package services;
import com.achcar_solutions.easycomm_core.entities.certificate.Certificate;
import com.achcar_solutions.easycomm_core.entities.certificate.CertificateCreationRequest;
import com.achcar_solutions.easycomm_api.services.CertificateService;
import com.achcar_solutions.easycomm_core.entities.certificate.CertificateStatus;
import com.achcar_solutions.easycomm_core.infra.ports.StoragePort;
import com.achcar_solutions.easycomm_core.repositories.CertificateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CertificateServiceTest {

    @Mock
    private CertificateRepository certificateRepository;

    @Mock
    private StoragePort storagePort;

    @Mock
    private org.springframework.kafka.core.KafkaTemplate<String, String> kafkaTemplate;

    @InjectMocks
    private CertificateService certificateService;

    private CertificateCreationRequest certifcateCreationRequest;
    private MockMultipartFile multipartFile;

    @BeforeEach
    void setup() {
        certifcateCreationRequest = new CertificateCreationRequest(
                "user@test.com",
                "Certificado de Teste",
                com.achcar_solutions.easycomm_core.entities.certificate.CertificateCategory.PALESTRAS_E_CURSOS,
                8,
                LocalDate.now().plusYears(1)
        );
        multipartFile = new MockMultipartFile(
                "file",
                "certificate.png",
                "image/png",
                "test image content".getBytes()
        );
    }

    @Test
    @DisplayName("Should create a certificate successfully when all data is valid")
    void shouldCreateCertificateSuccessfully() {
        Certificate savedCertificate = Certificate.builder()
                .id("some-random-id")
                .createdBy(certifcateCreationRequest.createdBy())
                .title(certifcateCreationRequest.title())
                .s3ObjectKey("some-unique-key.pdf")
                .status(CertificateStatus.PENDING)
                .build();

        when(certificateRepository.findByCreatedByAndTitleAndCategory(any(), any(), any()))
                .thenReturn(Optional.empty());

        when(storagePort.uploadFile(any(), any(), any()))
                .thenReturn("https://test.com/some-unique-key.pdf");

        when(certificateRepository.insert(any(Certificate.class)))
                .thenReturn(savedCertificate);

        Certificate createCertificateResult = certificateService.createCertificate(certifcateCreationRequest, multipartFile);

        assertNotNull(createCertificateResult);
        assertEquals(savedCertificate.getId(), createCertificateResult.getId());
        assertEquals(CertificateStatus.PENDING, createCertificateResult.getStatus());

        verify(storagePort, times(1)).uploadFile(any(), any(), any());
        verify(certificateRepository, times(1)).insert(any(Certificate.class));
        verify(kafkaTemplate, times(1)).send(anyString(), any());
    }

    @Test
    @DisplayName("Should throw exception when trying to create a duplicated certificate")
    void shouldThrowExceptionWhenCertificateAlreadyExists() {
        when(certificateRepository.findByCreatedByAndTitleAndCategory(
                certifcateCreationRequest.createdBy(),
                certifcateCreationRequest.title(),
                certifcateCreationRequest.category()
        )).thenReturn(Optional.of(Certificate.builder().build()));

        assertThrows(RuntimeException.class, () -> {
            certificateService.createCertificate(certifcateCreationRequest, multipartFile);
        });

        verify(storagePort, never()).uploadFile(any(), any(), any());
        verify(kafkaTemplate, never()).send(anyString(), any());
    }

    @Test
    @DisplayName("Should delete the certificate and the S3 bucket file when the ID exists")
    void shouldDeleteCertificateAndFileFromS3() {
        Certificate certificate = Certificate.builder()
                .id("some-random-id")
                .s3ObjectKey("some-unique-key.pdf")
                .build();

        when(certificateRepository.findById("some-random-id")).thenReturn(Optional.of(certificate));
        doNothing().when(storagePort).deleteFile(anyString());
        doNothing().when(certificateRepository).delete(any(Certificate.class));
        certificateService.deleteCertificate("some-random-id");

        verify(certificateRepository, times(1)).delete(certificate);
        verify(storagePort, times(1)).deleteFile("some-unique-key.pdf");
    }
}
