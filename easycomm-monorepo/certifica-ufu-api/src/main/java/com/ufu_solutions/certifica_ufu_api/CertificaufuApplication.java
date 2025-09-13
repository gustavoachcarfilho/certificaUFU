package com.ufu_solutions.certifica_ufu_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.achcar_solutions.easycomm_core.repositories")
@SpringBootApplication
public class CertificaufuApplication {

	public static void main(String[] args) {
		SpringApplication.run(CertificaufuApplication.class, args);
	}

}
