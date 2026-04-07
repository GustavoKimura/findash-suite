package com.findash.user;

import com.findash.Transaction;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class UserTest {

  @Test
  void testGettersAndSetters() {
    User user = new User();
    List<Transaction> transactions = new ArrayList<>();

    user.setId("user-1");
    user.setUsername("testuser");
    user.setPassword("hashedpassword");
    user.setTransactions(transactions);

    assertThat(user.getId()).isEqualTo("user-1");
    assertThat(user.getUsername()).isEqualTo("testuser");
    assertThat(user.getPassword()).isEqualTo("hashedpassword");
    assertThat(user.getTransactions()).isEqualTo(transactions);
  }
}