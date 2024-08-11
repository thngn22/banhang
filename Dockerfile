FROM maven:3.8.4-openjdk-17 AS base
WORKDIR /app/backend
COPY backend/pom.xml ./
RUN mvn dependency:go-offline
COPY backend/src ./src

COPY .env/ .env

FROM base AS build
WORKDIR /app/backend
RUN mvn -N io.takari:maven:wrapper -Dmaven=3.8.4
RUN chmod +x mvnw
RUN mvn clean:clean
RUN mvn install -DskipTests

FROM maven:3.8.4-openjdk-17
EXPOSE 7586

ARG APP_VERSION=1

ENV JAR_VERSION=${APP_VERSION}

COPY --from=build /app/backend/target/roblnk-*.jar /app/backend
CMD java -jar app-${JAR_VERSION}.jar

