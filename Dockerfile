# Etap 1: Budowanie (Build)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
# Kopiujemy pom.xml i pobieramy zależności (cache'owanie)
COPY pom.xml .
RUN mvn dependency:go-offline -B
# Kopiujemy kod źródłowy i budujemy paczkę
COPY src ./src
RUN mvn package -DskipTests

# Etap 2: Uruchamianie (Runtime)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Kopiujemy tylko gotowy plik JAR z poprzedniego etapu
COPY --from=build /app/target/*.jar app.jar
# Port, na którym działa Spring Boot
EXPOSE 8080
# Komenda startowa
ENTRYPOINT ["java", "-jar", "app.jar"]
