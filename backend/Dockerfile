FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /usr/src/app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package

FROM quay.io/wildfly/wildfly:32.0.1.Final-jdk21

COPY --from=build /usr/src/app/target/ROOT.war /opt/jboss/wildfly/standalone/deployments/

USER root

COPY entrypoint.sh /opt/jboss/
RUN chown jboss:jboss /opt/jboss/entrypoint.sh && chmod +x /opt/jboss/entrypoint.sh

USER jboss

EXPOSE 8080

ENTRYPOINT [ "/opt/jboss/entrypoint.sh" ]