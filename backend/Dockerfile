FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /usr/src/app

COPY pom.xml .
RUN mvn dependency:go-offline -B
RUN mvn dependency:copy -Dartifact=org.postgresql:postgresql:42.7.3 -DoutputDirectory=./drivers

COPY src ./src
RUN mvn package

FROM quay.io/wildfly/wildfly:33.0.1.Final-jdk21

COPY --from=build /usr/src/app/drivers/postgresql-42.7.3.jar /opt/jboss/drivers/
COPY --from=build /usr/src/app/target/ROOT.war /opt/jboss/wildfly/standalone/deployments/

USER root

COPY entrypoint.sh /opt/jboss/
RUN chown jboss:jboss /opt/jboss/entrypoint.sh /opt/jboss/drivers/postgresql-42.7.3.jar && \
  chmod +x /opt/jboss/entrypoint.sh

USER jboss

EXPOSE 8080

ENTRYPOINT [ "/opt/jboss/entrypoint.sh" ]