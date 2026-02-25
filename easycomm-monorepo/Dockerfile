FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copia o pom.xml pai
COPY pom.xml .

# Copia os módulos
COPY certifica-ufu-core/pom.xml ./certifica-ufu-core/
COPY certifica-ufu-api/pom.xml ./certifica-ufu-api/
COPY certifica-ufu-processor/pom.xml ./certifica-ufu-processor/

# Copia o código fonte
COPY certifica-ufu-core/src ./certifica-ufu-core/src
COPY certifica-ufu-api/src ./certifica-ufu-api/src
COPY certifica-ufu-processor/src ./certifica-ufu-processor/src

# Build do projeto
RUN mvn clean package -DskipTests -pl certifica-ufu-api -am

FROM eclipse-temurin:21-jre
WORKDIR /app

# Instala Tesseract OCR para processamento de imagens
RUN apt-get update && \
    apt-get install -y tesseract-ocr tesseract-ocr-por && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build /app/certifica-ufu-api/target/*.jar certifica-ufu-api.jar

ENTRYPOINT ["java", "-jar", "certifica-ufu-api.jar"]