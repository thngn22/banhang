FROM openjdk:17 AS base
WORKDIR /app/backend
COPY backend/.mvn/ .mvn
COPY backend/mvnw mvnw
COPY backend/src ./src
COPY backend/mvnw ./
COPY backend/mvnw.cmd ./
COPY backend/pom.xml ./

FROM base AS development
CMD ["./mvnw", "spring-boot:run"]

FROM base AS build
WORKDIR /app/backend
RUN ./mvnw clean install -DskipTests

FROM openjdk:17
EXPOSE 7586
COPY --from=build /app/backend/target/roblnk-1.jar app.jar
CMD ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

