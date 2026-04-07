package com.findash;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.findash.user.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.ws.rs.core.SecurityContext;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class TransactionResourceTest {

  @Mock
  private EntityManager em;

  @Mock
  private SecurityContext securityContext;

  @InjectMocks
  private TransactionResource transactionResource;

  @Test
  @SuppressWarnings("unchecked")
  void getAllShouldReturnTransactionsForUser() {
    Principal principal = mock(Principal.class);
    when(securityContext.getUserPrincipal()).thenReturn(principal);
    when(principal.getName()).thenReturn("testuser");

    User user = new User();
    user.setUsername("testuser");

    TypedQuery<User> userQuery = mock(TypedQuery.class);
    when(em.createQuery(anyString(), eq(User.class))).thenReturn(userQuery);
    when(userQuery.setParameter("username", "testuser")).thenReturn(userQuery);
    when(userQuery.getSingleResult()).thenReturn(user);

    Transaction t1 = new Transaction();
    Transaction t2 = new Transaction();
    TypedQuery<Transaction> transQuery = mock(TypedQuery.class);
    when(em.createQuery(anyString(), eq(Transaction.class))).thenReturn(transQuery);
    when(transQuery.setParameter("user", user)).thenReturn(transQuery);
    when(transQuery.getResultList()).thenReturn(Arrays.asList(t1, t2));

    List<Transaction> result = transactionResource.getAll();

    assertThat(result).hasSize(2);
  }
}