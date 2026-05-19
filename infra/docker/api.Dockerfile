FROM gradle:8.12.1-jdk21 AS build
WORKDIR /workspace
COPY . .
RUN gradle :apps:api:bootJar --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/apps/api/build/libs/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
