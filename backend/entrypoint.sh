#!/bin/bash

echo "Configurando datasource do PostgreSQL offline..."

/opt/jboss/wildfly/bin/jboss-cli.sh --file=/dev/stdin << EOF
embed-server --std-out=echo --server-config=standalone.xml
batch
/subsystem=datasources/jdbc-driver=postgresql:add(driver-name=postgresql,driver-module-name=org.postgres,driver-class-name=org.postgresql.Driver)
data-source add --name=PostgresDS --jndi-name=java:jboss/datasources/PostgresDS --driver-name=postgresql --connection-url=jdbc:postgresql://${DB_HOST}/${DB_NAME} --user-name=${DB_USER} --password=${DB_PASSWORD} --validate-on-match=true --check-valid-connection-sql="SELECT 1" --background-validation=false
run-batch
stop-embedded-server
EOF

if [ $? -ne 0 ]; then
    echo "Falha ao configurar o datasource."
    exit 1
fi

echo "Configuração offline concluída. Iniciando WildFly..."
exec /opt/jboss/wildfly/bin/standalone.sh -b 0.0.0.0