FROM openjdk:17
VOLUME /tmp
ARG JAR_FILE=backend/target/roblnk-1.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]

