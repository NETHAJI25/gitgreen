# DevLog Dockerfile
FROM eclipse-temurin:21-jdk-alpine as build
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:resolve
COPY src ./src
RUN ./mvnw package -DskipTests
# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 8080
ENTRYPOINT ["java","-jar","target/devlog-0.0.1-SNAPSHOT.jar"]