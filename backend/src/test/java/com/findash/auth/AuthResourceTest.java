package com.findash.auth;

import com.findash.user.User;
import com.findash.security.PasswordService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class AuthResourceTest {

  @Mock
  private EntityManager em;

  @Mock
  private PasswordService passwordService;

  @Mock
  private TokenService tokenService;

  @Mock
  private TypedQuery<Long> countQuery;

  @Mock
  private TypedQuery<User> userQuery;

  @InjectMocks
  private AuthResource authResource;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void register_PasswordsDoNotMatch_ReturnsBadRequest() {
    RegisterRequest request = new RegisterRequest();
    request.setPassword("123");
    request.setRepeatPassword("456");

    Response response = authResource.register(request);

    assertThat(response.getStatus()).isEqualTo(Response.Status.BAD_REQUEST.getStatusCode());
  }

  @Test
  void register_UserAlreadyExists_ReturnsConflict() {
    RegisterRequest request = new RegisterRequest();
    request.setUsername("testuser");
    request.setPassword("123");
    request.setRepeatPassword("123");

    when(em.createQuery(anyString(), eq(Long.class))).thenReturn(countQuery);
    when(countQuery.setParameter(anyString(), any())).thenReturn(countQuery);
    when(countQuery.getSingleResult()).thenReturn(1L);

    Response response = authResource.register(request);

    assertThat(response.getStatus()).isEqualTo(Response.Status.CONFLICT.getStatusCode());
  }

  @Test
  void register_Success_ReturnsCreated() {
    RegisterRequest request = new RegisterRequest();
    request.setUsername("testuser");
    request.setPassword("123");
    request.setRepeatPassword("123");

    when(em.createQuery(anyString(), eq(Long.class))).thenReturn(countQuery);
    when(countQuery.setParameter(anyString(), any())).thenReturn(countQuery);
    when(countQuery.getSingleResult()).thenReturn(0L);
    when(passwordService.hashPassword("123")).thenReturn("hashed");

    Response response = authResource.register(request);

    assertThat(response.getStatus()).isEqualTo(Response.Status.CREATED.getStatusCode());
    verify(em).persist(any(User.class));
  }

  @Test
  void login_UserNotFound_ReturnsUnauthorized() {
    LoginRequest request = new LoginRequest();
    request.setUsername("testuser");
    request.setPassword("123");

    when(em.createQuery(anyString(), eq(User.class))).thenReturn(userQuery);
    when(userQuery.setParameter(anyString(), any())).thenReturn(userQuery);
    when(userQuery.getSingleResult()).thenThrow(new NoResultException());

    Response response = authResource.login(request);

    assertThat(response.getStatus()).isEqualTo(Response.Status.UNAUTHORIZED.getStatusCode());
  }

  @Test
  void login_WrongPassword_ReturnsUnauthorized() {
    LoginRequest request = new LoginRequest();
    request.setUsername("testuser");
    request.setPassword("wrong");

    User mockUser = new User();
    mockUser.setPassword("hashed");

    when(em.createQuery(anyString(), eq(User.class))).thenReturn(userQuery);
    when(userQuery.setParameter(anyString(), any())).thenReturn(userQuery);
    when(userQuery.getSingleResult()).thenReturn(mockUser);
    when(passwordService.checkPassword("wrong", "hashed")).thenReturn(false);

    Response response = authResource.login(request);

    assertThat(response.getStatus()).isEqualTo(Response.Status.UNAUTHORIZED.getStatusCode());
  }

  @Test
  void login_Success_ReturnsOkWithToken() {
    LoginRequest request = new LoginRequest();
    request.setUsername("testuser");
    request.setPassword("123");

    User mockUser = new User();
    mockUser.setUsername("testuser");
    mockUser.setPassword("hashed");

    when(em.createQuery(anyString(), eq(User.class))).thenReturn(userQuery);
    when(userQuery.setParameter(anyString(), any())).thenReturn(userQuery);
    when(userQuery.getSingleResult()).thenReturn(mockUser);
    when(passwordService.checkPassword("123", "hashed")).thenReturn(true);
    when(tokenService.generateToken("testuser")).thenReturn("mock-token");

    Response response = authResource.login(request);

    assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());
    AuthResponse entity = (AuthResponse) response.getEntity();
    assertThat(entity.getToken()).isEqualTo("mock-token");
    assertThat(entity.getUsername()).isEqualTo("testuser");
  }
}