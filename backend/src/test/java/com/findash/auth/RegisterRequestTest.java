package com.findash.auth;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class RegisterRequestTest {

  @Test
  void testGettersAndSetters() {
    RegisterRequest request = new RegisterRequest();

    request.setUsername("admin");
    request.setPassword("123456");
    request.setRepeatPassword("123456");

    assertThat(request.getUsername()).isEqualTo("admin");
    assertThat(request.getPassword()).isEqualTo("123456");
    assertThat(request.getRepeatPassword()).isEqualTo("123456");
  }
}