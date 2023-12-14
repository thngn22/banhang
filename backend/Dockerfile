FROM openjdk:17
VOLUME /tmp
COPY run.sh .
COPY target/*.jar app.jar
ENTRYPOINT ["run.sh"]