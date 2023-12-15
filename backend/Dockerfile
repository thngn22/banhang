FROM openjdk:17
WORKDIR /app
ARG JAR_FILE=target/roblnk-1.jar
COPY ${JAR_FILE} app.jar
EXPOSE 7586
ENTRYPOINT ["java","-jar","app.jar"]
