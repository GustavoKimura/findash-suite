package com.findash;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.core.MultivaluedHashMap;
import jakarta.ws.rs.core.MultivaluedMap;
import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class CorsFilterTest {

  @Test
  void testFilter() throws IOException {
    CorsFilter filter = new CorsFilter();
    ContainerRequestContext requestContext = mock(ContainerRequestContext.class);
    ContainerResponseContext responseContext = mock(ContainerResponseContext.class);
    MultivaluedMap<String, Object> headers = new MultivaluedHashMap<>();

    when(responseContext.getHeaders()).thenReturn(headers);

    filter.filter(requestContext, responseContext);

    assertThat(headers.getFirst("Access-Control-Allow-Origin")).isEqualTo("*");
    assertThat(headers.getFirst("Access-Control-Allow-Credentials")).isEqualTo("true");
  }
}