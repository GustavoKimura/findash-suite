package com.findash.auth;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class AuthResponseTest {

  @Test
  void testGettersAndSetters() {
    AuthResponse response = new AuthResponse("token-inicial", "usuario-inicial");

    response.setToken("novo-token");
    response.setUsername("novo-usuario");

    assertThat(response.getToken()).isEqualTo("novo-token");
    assertThat(response.getUsername()).isEqualTo("novo-usuario");
  }
}