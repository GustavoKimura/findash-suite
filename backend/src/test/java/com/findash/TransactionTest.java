package com.findash;

import com.findash.user.User;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

public class TransactionTest {

  @Test
  void testGettersAndSetters() {
    Transaction transaction = new Transaction();
    User user = new User();
    LocalDate date = LocalDate.now();

    transaction.setId("123");
    transaction.setType("Despesa");
    transaction.setDescription("Compra");
    transaction.setAmount(new BigDecimal("50.0"));
    transaction.setCategory("Alimentação");
    transaction.setDate(date);
    transaction.setUser(user);

    assertThat(transaction.getId()).isEqualTo("123");
    assertThat(transaction.getType()).isEqualTo("Despesa");
    assertThat(transaction.getDescription()).isEqualTo("Compra");
    assertThat(transaction.getAmount()).isEqualTo(new BigDecimal("50.0"));
    assertThat(transaction.getCategory()).isEqualTo("Alimentação");
    assertThat(transaction.getDate()).isEqualTo(date);
    assertThat(transaction.getUser()).isEqualTo(user);
  }
}