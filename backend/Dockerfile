FROM quay.io/wildfly/wildfly:32.0.1.Final-jdk21

COPY ./target/ROOT.war /opt/jboss/wildfly/standalone/deployments/

COPY entrypoint.sh /opt/jboss/
RUN chmod +x /opt/jboss/entrypoint.sh

EXPOSE 8080

ENTRYPOINT [ "/opt/jboss/entrypoint.sh" ]