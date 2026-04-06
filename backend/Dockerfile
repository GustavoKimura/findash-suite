FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /usr/src/app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests

FROM quay.io/wildfly/wildfly:35.0.1.Final-jdk21

USER root
RUN curl -L -o /tmp/postgresql.jar https://jdbc.postgresql.org/download/postgresql-42.7.3.jar

USER jboss
RUN echo "embed-server --server-config=standalone.xml --std-out=echo" > /tmp/setup.cli && \
  echo "module add --name=org.postgresql --resources=/tmp/postgresql.jar" >> /tmp/setup.cli && \
  echo "/subsystem=datasources/jdbc-driver=postgresql:add(driver-name=postgresql,driver-module-name=org.postgresql,driver-xa-datasource-class-name=org.postgresql.xa.PGXADataSource)" >> /tmp/setup.cli && \
  echo "data-source add --name=PostgresDS --jndi-name=java:jboss/datasources/PostgresDS --driver-name=postgresql --connection-url=jdbc:postgresql://\${env.DB_HOST:localhost}:5432/\${env.DB_NAME:findashdb} --user-name=\${env.DB_USER:findash_user} --password=\${env.DB_PASSWORD:password} --validate-on-match=true" >> /tmp/setup.cli && \
  echo "stop-embedded-server" >> /tmp/setup.cli && \
  /opt/jboss/wildfly/bin/jboss-cli.sh --file=/tmp/setup.cli && \
  rm -rf /opt/jboss/wildfly/standalone/configuration/standalone_xml_history /tmp/setup.cli /tmp/postgresql.jar

COPY --from=build /usr/src/app/target/ROOT.war /opt/jboss/wildfly/standalone/deployments/

USER root
RUN chown jboss:jboss /opt/jboss/wildfly/standalone/deployments/ROOT.war
USER jboss

EXPOSE 8080