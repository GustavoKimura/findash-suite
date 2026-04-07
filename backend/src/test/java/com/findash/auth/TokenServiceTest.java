package com.findash.auth;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TokenServiceTest {

  private TokenService tokenService;

  @BeforeEach
  public void setUp() {
    tokenService = new TokenService();
  }

  @Test
  void shouldGenerateAndValidateToken() {
    String username = "testuser";
    String token = tokenService.generateToken(username);

    assertThat(token).isNotNull();

    Optional<String> usernameFromToken = tokenService.getUsernameFromToken(token);
    assertThat(usernameFromToken).isPresent();
    assertThat(usernameFromToken.get()).isEqualTo(username);
  }

  @Test
  void shouldReturnEmptyForInvalidToken() {
    Optional<String> username = tokenService.getUsernameFromToken("invalid.token.here");
    assertThat(username).isEmpty();
  }
}