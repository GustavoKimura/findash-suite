package com.findash;

import com.findash.user.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class TransactionResourceTest {

  @Mock
  private EntityManager em;

  @Mock
  private SecurityContext securityContext;

  @Mock
  private Principal principal;

  @Mock
  private TypedQuery<User> userQuery;

  @Mock
  private TypedQuery<Transaction> transactionQuery;

  @InjectMocks
  private TransactionResource transactionResource;

  private User mockUser;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    when(securityContext.getUserPrincipal()).thenReturn(principal);
    when(principal.getName()).thenReturn("testuser");

    mockUser = new User();
    mockUser.setId("user-id");
    mockUser.setUsername("testuser");

    when(em.createQuery("SELECT u FROM User u WHERE u.username = :username", User.class)).thenReturn(userQuery);
    when(userQuery.setParameter("username", "testuser")).thenReturn(userQuery);
    when(userQuery.getSingleResult()).thenReturn(mockUser);
  }

  @Test
  void getCurrentUser_UserNotFound_ThrowsException() {
    when(userQuery.getSingleResult()).thenThrow(new NoResultException());

    Throwable thrown = catchThrowable(() -> transactionResource.getAll());

    assertThat(thrown).isInstanceOf(WebApplicationException.class)
        .hasMessageContaining("User not found");
  }

  @Test
  void getAll_ReturnsUserTransactions() {
    Transaction t = new Transaction();
    when(em.createQuery(anyString(), eq(Transaction.class))).thenReturn(transactionQuery);
    when(transactionQuery.setParameter("user", mockUser)).thenReturn(transactionQuery);
    when(transactionQuery.getResultList()).thenReturn(Collections.singletonList(t));

    List<Transaction> result = transactionResource.getAll();

    assertThat(result).hasSize(1).containsExactly(t);
  }

  @Test
  void create_PersistsAndReturnsCreated() {
    Transaction t = new Transaction();
    t.setAmount(BigDecimal.TEN);

    Response response = transactionResource.create(t);

    assertThat(response.getStatus()).isEqualTo(Response.Status.CREATED.getStatusCode());
    verify(em).persist(t);
    assertThat(t.getId()).isNotNull();
    assertThat(t.getUser()).isEqualTo(mockUser);
  }

  @Test
  void update_TransactionNotFound_ReturnsNotFound() {
    when(em.find(Transaction.class, "tx-id")).thenReturn(null);

    Response response = transactionResource.update("tx-id", new Transaction());

    assertThat(response.getStatus()).isEqualTo(Response.Status.NOT_FOUND.getStatusCode());
  }

  @Test
  void update_TransactionBelongsToOtherUser_ReturnsNotFound() {
    Transaction existing = new Transaction();
    User otherUser = new User();
    otherUser.setId("other-id");
    existing.setUser(otherUser);

    when(em.find(Transaction.class, "tx-id")).thenReturn(existing);

    Response response = transactionResource.update("tx-id", new Transaction());

    assertThat(response.getStatus()).isEqualTo(Response.Status.NOT_FOUND.getStatusCode());
  }

  @Test
  void update_Success_ReturnsOk() {
    Transaction existing = new Transaction();
    existing.setUser(mockUser);

    Transaction updateData = new Transaction();
    updateData.setAmount(BigDecimal.ONE);

    when(em.find(Transaction.class, "tx-id")).thenReturn(existing);
    when(em.merge(updateData)).thenReturn(updateData);

    Response response = transactionResource.update("tx-id", updateData);

    assertThat(response.getStatus()).isEqualTo(Response.Status.OK.getStatusCode());
    assertThat(updateData.getId()).isEqualTo("tx-id");
    assertThat(updateData.getUser()).isEqualTo(mockUser);
    verify(em).merge(updateData);
  }

  @Test
  void delete_TransactionNotFound_ReturnsNotFound() {
    when(em.find(Transaction.class, "tx-id")).thenReturn(null);

    Response response = transactionResource.delete("tx-id");

    assertThat(response.getStatus()).isEqualTo(Response.Status.NOT_FOUND.getStatusCode());
  }

  @Test
  void delete_TransactionBelongsToOtherUser_ReturnsNotFound() {
    Transaction existing = new Transaction();
    User otherUser = new User();
    otherUser.setId("other-id");
    existing.setUser(otherUser);

    when(em.find(Transaction.class, "tx-id")).thenReturn(existing);

    Response response = transactionResource.delete("tx-id");

    assertThat(response.getStatus()).isEqualTo(Response.Status.NOT_FOUND.getStatusCode());
  }

  @Test
  void delete_Success_ReturnsNoContent() {
    Transaction existing = new Transaction();
    existing.setUser(mockUser);

    when(em.find(Transaction.class, "tx-id")).thenReturn(existing);

    Response response = transactionResource.delete("tx-id");

    assertThat(response.getStatus()).isEqualTo(Response.Status.NO_CONTENT.getStatusCode());
    verify(em).remove(existing);
  }
}