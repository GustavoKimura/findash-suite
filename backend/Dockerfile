FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /usr/src/app

COPY pom.xml .
RUN mvn dependency:go-offline -B
RUN mvn dependency:copy -Dartifact=org.postgresql:postgresql:42.7.3 -DoutputDirectory=./drivers

COPY src ./src
RUN mvn package

FROM quay.io/wildfly/wildfly:33.0.1.Final-jdk21

COPY --from=build /usr/src/app/target/ROOT.war /opt/jboss/wildfly/standalone/deployments/
COPY --from=build /usr/src/app/drivers/postgresql-42.7.3.jar /opt/jboss/wildfly/modules/system/layers/base/org/postgres/main/
COPY module.xml /opt/jboss/wildfly/modules/system/layers/base/org/postgres/main/

USER root

COPY entrypoint.sh /opt/jboss/
RUN chown -R jboss:jboss /opt/jboss/wildfly/modules/system/layers/base/org/postgres/ && \
  chown jboss:jboss /opt/jboss/entrypoint.sh && \
  chmod +x /opt/jboss/entrypoint.sh

USER jboss

EXPOSE 8080

ENTRYPOINT [ "/opt/jboss/entrypoint.sh" ]