package com.certificaufu.certifica_ufu_backend.entities.certificate;

import com.certificaufu.certifica_ufu_backend.entities.authuser.AuthUser;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Table(name = "certificates")
@Entity(name = "certificates")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@Builder
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private AuthUser sender;
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CertificateCategory category;
    private Integer durationInHours;
    private LocalDate expirationDate;
    private String fileUrl;
    private String originalFilename;
    private String fileType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CertificateStatus status;

    @CreationTimestamp
    private LocalDateTime uploadTimestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "validator_id")
    private AuthUser validator;

    private LocalDateTime validationTimestamp;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;
}
