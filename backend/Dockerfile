FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /usr/src/app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests

FROM jboss/wildfly:33.0.1.Final-jdk21

ENV POSTGRES_JNDI="java:jboss/datasources/PostgresDS" \
  POSTGRES_DATABASE="${DB_NAME}" \
  POSTGRES_USER="${DB_USER}" \
  POSTGRES_PASSWORD="${DB_PASSWORD}" \
  POSTGRES_HOST="${DB_HOST}" \
  POSTGRES_ENABLED="true"

COPY --from=build /usr/src/app/target/ROOT.war /opt/jboss/wildfly/standalone/deployments/

USER root
RUN chown jboss:jboss /opt/jboss/wildfly/standalone/deployments/ROOT.war
USER jboss

EXPOSE 8080