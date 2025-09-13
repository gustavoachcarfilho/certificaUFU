package com.achcar_solutions.easycomm_processor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.achcar_solutions.easycomm_core.repositories")
@SpringBootApplication
public class EasycommProcessorApplication {

	public static void main(String[] args) {
		SpringApplication.run(EasycommProcessorApplication.class, args);
	}

}
