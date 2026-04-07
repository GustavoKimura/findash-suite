package com.findash.security;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class PasswordServiceTest {

  private PasswordService passwordService;

  @BeforeEach
  public void setUp() {
    passwordService = new PasswordService();
  }

  @Test
  void shouldHashAndVerifyPassword() {
    String password = "secretPassword123";
    String hashed = passwordService.hashPassword(password);

    assertThat(hashed).isNotEqualTo(password);
    assertThat(passwordService.checkPassword(password, hashed)).isTrue();
  }

  @Test
  void shouldFailForWrongPassword() {
    String password = "secretPassword123";
    String hashed = passwordService.hashPassword(password);

    assertThat(passwordService.checkPassword("wrongPassword", hashed)).isFalse();
  }
}