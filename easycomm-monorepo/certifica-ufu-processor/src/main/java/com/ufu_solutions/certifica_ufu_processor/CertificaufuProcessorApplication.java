package com.ufu_solutions.certifica_ufu_processor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.achcar_solutions.easycomm_core.repositories")
@SpringBootApplication
public class CertificaufuProcessorApplication {

	public static void main(String[] args) {
		SpringApplication.run(CertificaufuProcessorApplication.class, args);
	}

}
