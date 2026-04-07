package com.findash;

import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/health")
@RequestScoped
public class HealthResource {

  @GET
  public Response check() {
    return Response.ok("OK").build();
  }
}