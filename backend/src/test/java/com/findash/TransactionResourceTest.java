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
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
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

  private User testUser;
  private Transaction testTransaction;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setId("user-id");
    testUser.setUsername("testuser");

    testTransaction = new Transaction();
    testTransaction.setId("tx-id");
    testTransaction.setAmount(new BigDecimal("100.00"));
    testTransaction.setDescription("Test TX");
    testTransaction.setCategory("Lazer");
    testTransaction.setType("Despesa");
    testTransaction.setDate(LocalDate.now());
    testTransaction.setUser(testUser);
  }

  private void mockSecurityContext() {
    when(securityContext.getUserPrincipal()).thenReturn(principal);
    when(principal.getName()).thenReturn("testuser");
    when(em.createQuery(anyString(), eq(User.class))).thenReturn(userQuery);
    when(userQuery.setParameter(anyString(), anyString())).thenReturn(userQuery);
    when(userQuery.getSingleResult()).thenReturn(testUser);
  }

  @Test
  void getAll_returnsTransactions() {
    mockSecurityContext();
    when(em.createQuery(anyString(), eq(Transaction.class))).thenReturn(transactionQuery);
    when(transactionQuery.setParameter(anyString(), any(User.class))).thenReturn(transactionQuery);
    when(transactionQuery.getResultList()).thenReturn(List.of(testTransaction));

    List<Transaction> result = transactionResource.getAll();

    assertEquals(1, result.size());
    assertEquals("tx-id", result.get(0).getId());
  }

  @Test
  void create_persistsTransactionAndReturnsCreated() {
    mockSecurityContext();
    Transaction newTx = new Transaction();
    newTx.setAmount(new BigDecimal("50.00"));

    Response response = transactionResource.create(newTx);

    assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
    assertNotNull(((Transaction) response.getEntity()).getId());
    verify(em, times(1)).persist(newTx);
  }

  @Test
  void update_existingTransaction_returnsOk() {
    mockSecurityContext();
    when(em.find(Transaction.class, "tx-id")).thenReturn(testTransaction);
    when(em.merge(any(Transaction.class))).thenReturn(testTransaction);

    Response response = transactionResource.update("tx-id", testTransaction);

    assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
    verify(em, times(1)).merge(testTransaction);
  }

  @Test
  void update_nonExistingTransaction_returnsNotFound() {
    mockSecurityContext();
    when(em.find(Transaction.class, "invalid-id")).thenReturn(null);

    Response response = transactionResource.update("invalid-id", testTransaction);

    assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
  }

  @Test
  void delete_existingTransaction_returnsNoContent() {
    mockSecurityContext();
    when(em.find(Transaction.class, "tx-id")).thenReturn(testTransaction);

    Response response = transactionResource.delete("tx-id");

    assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());
    verify(em, times(1)).remove(testTransaction);
  }

  @Test
  void delete_nonExistingTransaction_returnsNotFound() {
    mockSecurityContext();
    when(em.find(Transaction.class, "invalid-id")).thenReturn(null);

    Response response = transactionResource.delete("invalid-id");

    assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
  }

  @Test
  void getCurrentUser_userNotFound_throwsWebApplicationException() {
    when(securityContext.getUserPrincipal()).thenReturn(principal);
    when(principal.getName()).thenReturn("testuser");
    when(em.createQuery(anyString(), eq(User.class))).thenReturn(userQuery);
    when(userQuery.setParameter(anyString(), anyString())).thenReturn(userQuery);
    when(userQuery.getSingleResult()).thenThrow(new NoResultException());

    WebApplicationException exception = assertThrows(WebApplicationException.class, () -> {
      transactionResource.getAll();
    });

    assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), exception.getResponse().getStatus());
  }
}