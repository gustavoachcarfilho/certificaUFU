FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY easycomm-api/pom.xml .
COPY easycomm-api/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

RUN apt-get update && \
    apt-get install -y tesseract-ocr tesseract-ocr-por && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build /app/target/*.jar easycomm.jar

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

ENV AWS_REGION=us-east-1
ENV AWS_BUCKET_NAME=easycomm-bucket

ENTRYPOINT ["java", "-jar", "easycomm.jar"]