FROM maven:3.8.4-openjdk-17 AS base
WORKDIR /app/backend
COPY backend/.mvn/ .mvn
COPY backend/mvnw mvnw
COPY backend/src ./src
COPY backend/mvnw ./
COPY backend/mvnw.cmd ./
COPY backend/pom.xml ./
COPY .env/ .env

FROM base AS build
WORKDIR /app/backend
RUN mvn -N io.takari:maven:wrapper -Dmaven=3.8.4
RUN chmod +x mvnw
RUN mvn clean:clean
RUN mvn install -DskipTests

FROM maven:3.8.4-openjdk-17
EXPOSE 7586
COPY --from=build /app/backend/target/roblnk-1.jar app.jar
CMD ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

