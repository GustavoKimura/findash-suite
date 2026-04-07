package com.findash;

import static org.assertj.core.api.Assertions.assertThat;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;

public class HealthResourceTest {

  @Test
  void checkShouldReturnOk() {
    HealthResource healthResource = new HealthResource();
    Response response = healthResource.check();

    assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());
    assertThat(response.getEntity()).isEqualTo("OK");
  }
}