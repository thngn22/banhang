#Build
#Multi-Staging
FROM openjdk:17
WORKDIR /app
ARG JAR_FILE=backend/target/roblnk-1.jar
COPY ${JAR_FILE} app.jar
EXPOSE 7586
CMD ["java", "-jar", "app.jar"]
