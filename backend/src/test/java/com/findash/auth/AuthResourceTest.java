package com.findash.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.findash.security.PasswordService;
import com.findash.user.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class AuthResourceTest {

  @Mock
  private EntityManager em;

  @Mock
  private PasswordService passwordService;

  @Mock
  private TokenService tokenService;

  @InjectMocks
  private AuthResource authResource;

  @Test
  @SuppressWarnings("unchecked")
  void registerShouldReturnConflictIfUserExists() {
    RegisterRequest request = new RegisterRequest();
    request.setUsername("existingUser");
    request.setPassword("password");
    request.setRepeatPassword("password");

    TypedQuery<Long> query = mock(TypedQuery.class);
    when(em.createQuery(anyString(), eq(Long.class))).thenReturn(query);
    when(query.setParameter("username", "existingUser")).thenReturn(query);
    when(query.getSingleResult()).thenReturn(1L);

    Response response = authResource.register(request);

    assertThat(response.getStatus()).isEqualTo(Response.Status.CONFLICT.getStatusCode());
  }

  @Test
  @SuppressWarnings("unchecked")
  void loginShouldReturnOkWithToken() {
    LoginRequest request = new LoginRequest();
    request.setUsername("user");
    request.setPassword("pass");

    User user = new User();
    user.setUsername("user");
    user.setPassword("hashedPass");

    TypedQuery<User> query = mock(TypedQuery.class);
    when(em.createQuery(anyString(), eq(User.class))).thenReturn(query);
    when(query.setParameter("username", "user")).thenReturn(query);
    when(query.getSingleResult()).thenReturn(user);
    when(passwordService.checkPassword("pass", "hashedPass")).thenReturn(true);
    when(tokenService.generateToken("user")).thenReturn("valid-token");

    Response response = authResource.login(request);

    assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());
    AuthResponse authResponse = (AuthResponse) response.getEntity();
    assertThat(authResponse.getToken()).isEqualTo("valid-token");
  }
}