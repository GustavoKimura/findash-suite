package com.findash.auth;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class LoginRequestTest {

  @Test
  void testGettersAndSetters() {
    LoginRequest request = new LoginRequest();

    request.setUsername("admin");
    request.setPassword("123456");

    assertThat(request.getUsername()).isEqualTo("admin");
    assertThat(request.getPassword()).isEqualTo("123456");
  }
}