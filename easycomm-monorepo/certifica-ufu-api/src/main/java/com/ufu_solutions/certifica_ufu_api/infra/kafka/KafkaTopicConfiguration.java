package com.ufu_solutions.certifica_ufu_api.infra.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfiguration {
    public static final String CERTIFICATE_TOPIC = "certificates-to-process";
    public static final String CERTIFICATE_OCR_COMPLETED_TOPIC = "certificates-ocr-completed";

    @Bean
    public NewTopic certificatesToProcessTopic() {
        return TopicBuilder.name(CERTIFICATE_TOPIC)
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic certificatesOcrCompletedTopic() {
        return TopicBuilder.name(CERTIFICATE_OCR_COMPLETED_TOPIC)
                .partitions(1)
                .replicas(1)
                .build();
    }
}
