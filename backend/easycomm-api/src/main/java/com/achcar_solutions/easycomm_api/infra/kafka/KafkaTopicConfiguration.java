package com.achcar_solutions.easycomm_api.infra.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfiguration {
    public static final String CERTIFICATE_TOPIC = "certificates-to-process";

    @Bean
    public NewTopic certificatesToProcessTopic() {
        return TopicBuilder.name(CERTIFICATE_TOPIC)
                .partitions(1)
                .replicas(1)
                .build();
    }
}
