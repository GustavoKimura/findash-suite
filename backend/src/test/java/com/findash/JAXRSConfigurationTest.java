package com.findash;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class JAXRSConfigurationTest {

  @Test
  void testInstantiation() {
    JAXRSConfiguration config = new JAXRSConfiguration();
    assertThat(config).isNotNull();
  }
}