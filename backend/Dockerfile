FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /usr/src/app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests

FROM quay.io/wildfly/wildfly-s2i-jdk21:latest

USER root
RUN galaunch.sh install org.wildfly:wildfly-galleon-pack:33.0.1.Final#galleon/postgresql-datasource
COPY --from=build /usr/src/app/target/ROOT.war /opt/server/standalone/deployments/
RUN chown -R 1001:0 /opt/server && chmod -R g+rw /opt/server

USER 1001

ENV JDBC_URL="jdbc:postgresql://${DB_HOST}/${DB_NAME}" \
  JDBC_USER="${DB_USER}" \
  JDBC_PASSWORD="${DB_PASSWORD}" \
  DATASOURCES_NAMES="PostgresDS" \
  PostgresDS_JNDI_NAME="java:jboss/datasources/PostgresDS" \
  PostgresDS_DRIVER_NAME="postgresql"

EXPOSE 8080