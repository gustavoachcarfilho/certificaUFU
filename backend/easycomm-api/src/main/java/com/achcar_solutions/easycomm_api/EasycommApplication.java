package com.achcar_solutions.easycomm_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.achcar_solutions.easycomm_core.repositories")
@SpringBootApplication
public class EasycommApplication {

	public static void main(String[] args) {
		SpringApplication.run(EasycommApplication.class, args);
	}

}
