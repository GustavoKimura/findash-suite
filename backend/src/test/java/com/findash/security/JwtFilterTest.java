package com.findash.security;

import com.findash.auth.TokenService;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class JwtFilterTest {

  @Mock
  private TokenService tokenService;

  @Mock
  private ContainerRequestContext requestContext;

  @InjectMocks
  private JwtFilter jwtFilter;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void filter_NoAuthHeader_AbortsWithUnauthorized() throws IOException {
    when(requestContext.getHeaderString("Authorization")).thenReturn(null);

    jwtFilter.filter(requestContext);

    verify(requestContext).abortWith(any(Response.class));
  }

  @Test
  void filter_InvalidAuthHeader_AbortsWithUnauthorized() throws IOException {
    when(requestContext.getHeaderString("Authorization")).thenReturn("Basic token");

    jwtFilter.filter(requestContext);

    verify(requestContext).abortWith(any(Response.class));
  }

  @Test
  void filter_ValidToken_SetsSecurityContext() throws IOException {
    when(requestContext.getHeaderString("Authorization")).thenReturn("Bearer token-valido");
    when(tokenService.getUsernameFromToken("token-valido")).thenReturn(Optional.of("testuser"));

    SecurityContext originalContext = mock(SecurityContext.class);
    when(originalContext.isSecure()).thenReturn(true);
    when(requestContext.getSecurityContext()).thenReturn(originalContext);

    jwtFilter.filter(requestContext);

    ArgumentCaptor<SecurityContext> captor = ArgumentCaptor.forClass(SecurityContext.class);
    verify(requestContext).setSecurityContext(captor.capture());

    SecurityContext newContext = captor.getValue();
    assertThat(newContext.getUserPrincipal().getName()).isEqualTo("testuser");
    assertThat(newContext.isUserInRole("any")).isTrue();
    assertThat(newContext.isSecure()).isTrue();
    assertThat(newContext.getAuthenticationScheme()).isEqualTo("Bearer");
  }

  @Test
  void filter_InvalidToken_AbortsWithUnauthorized() throws IOException {
    when(requestContext.getHeaderString("Authorization")).thenReturn("Bearer token-invalido");
    when(tokenService.getUsernameFromToken("token-invalido")).thenReturn(Optional.empty());

    jwtFilter.filter(requestContext);

    verify(requestContext).abortWith(any(Response.class));
  }
}