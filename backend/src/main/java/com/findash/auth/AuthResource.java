package com.findash.auth;

import com.findash.user.User;
import com.findash.security.PasswordService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.UUID;

@Path("/auth")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

  @PersistenceContext
  private EntityManager em;

  @Inject
  private PasswordService passwordService;

  @Inject
  private TokenService tokenService;

  @POST
  @Path("/register")
  @Transactional
  public Response register(RegisterRequest registerRequest) {
    if (!registerRequest.getPassword().equals(registerRequest.getRepeatPassword())) {
      return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\":\"Passwords do not match\"}").build();
    }

    long count = em.createQuery("SELECT COUNT(u) FROM User u WHERE u.username = :username", Long.class)
        .setParameter("username", registerRequest.getUsername())
        .getSingleResult();

    if (count > 0) {
      return Response.status(Response.Status.CONFLICT).entity("{\"error\":\"Username already exists\"}").build();
    }

    User newUser = new User();
    newUser.setId(UUID.randomUUID().toString());
    newUser.setUsername(registerRequest.getUsername());
    newUser.setPassword(passwordService.hashPassword(registerRequest.getPassword()));
    em.persist(newUser);

    return Response.status(Response.Status.CREATED).build();
  }

  @POST
  @Path("/login")
  @Transactional
  public Response login(LoginRequest loginRequest) {
    try {
      User user = em.createQuery("SELECT u FROM User u WHERE u.username = :username", User.class)
          .setParameter("username", loginRequest.getUsername())
          .getSingleResult();

      if (passwordService.checkPassword(loginRequest.getPassword(), user.getPassword())) {
        String token = tokenService.generateToken(user.getUsername());
        return Response.ok(new AuthResponse(token, user.getUsername())).build();
      } else {
        return Response.status(Response.Status.UNAUTHORIZED).entity("{\"error\":\"Invalid username or password\"}")
            .build();
      }
    } catch (NoResultException e) {
      return Response.status(Response.Status.UNAUTHORIZED).entity("{\"error\":\"Invalid username or password\"}")
          .build();
    }
  }
}