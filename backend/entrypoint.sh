#!/bin/bash

/opt/jboss/wildfly/bin/standalone.sh -b 0.0.0.0 &

echo "Aguardando WildFly iniciar..."
while ! /opt/jboss/wildfly/bin/jboss-cli.sh -c "ls /deployment" >/dev/null; do
    sleep 1
done

echo "Configurando datasource do PostgreSQL..."

/opt/jboss/wildfly/bin/jboss-cli.sh --connect \
"module add --name=org.postgres --resources=/opt/jboss/wildfly/standalone/deployments/ROOT.war/WEB-INF/lib/postgresql-42.7.3.jar --dependencies=jakarta.jdbc.api,jakarta.transaction.api; \
/subsystem=datasources/jdbc-driver=postgresql:add(driver-name=postgresql,driver-module-name=org.postgres,driver-class-name=org.postgresql.Driver); \
data-source add \
--name=PostgresDS \
--jndi-name=java:jboss/datasources/PostgresDS \
--driver-name=postgresql \
--connection-url=jdbc:postgresql://${DB_HOST}/${DB_NAME} \
--user-name=${DB_USER} \
--password=${DB_PASSWORD} \
--validate-on-match=true \
--check-valid-connection-sql=\"SELECT 1\" \
--background-validation=false"

echo "Configuração concluída. Reiniciando WildFly em modo normal..."

/opt/jboss/wildfly/bin/jboss-cli.sh -c ":shutdown"

exec /opt/jboss/wildfly/bin/standalone.sh -b 0.0.0.0