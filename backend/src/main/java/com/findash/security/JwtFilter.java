package com.findash.security;

import com.findash.auth.TokenService;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

import java.io.IOException;
import java.security.Principal;
import java.util.Optional;

@Provider
public class JwtFilter implements ContainerRequestFilter {

  @Inject
  private TokenService tokenService;

  @Override
  public void filter(ContainerRequestContext requestContext) throws IOException {
    String path = requestContext.getUriInfo().getPath();
    if (path.startsWith("auth/") || path.equals("health")) {
      return;
    }

    String authHeader = requestContext.getHeaderString("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
      return;
    }

    String token = authHeader.substring("Bearer ".length()).trim();
    Optional<String> usernameOptional = tokenService.getUsernameFromToken(token);

    if (usernameOptional.isPresent()) {
      String username = usernameOptional.get();
      SecurityContext originalContext = requestContext.getSecurityContext();
      requestContext.setSecurityContext(new SecurityContext() {
        @Override
        public Principal getUserPrincipal() {
          return () -> username;
        }

        @Override
        public boolean isUserInRole(String role) {
          return true;
        }

        @Override
        public boolean isSecure() {
          return originalContext.isSecure();
        }

        @Override
        public String getAuthenticationScheme() {
          return "Bearer";
        }
      });
    } else {
      requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
    }
  }
}