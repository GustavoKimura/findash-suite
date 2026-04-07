package com.findash.auth;

import com.findash.security.PasswordService;
import com.findash.user.User;
import com.findash.common.BaseResource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.UUID;

@Path("/auth")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource extends BaseResource {

  @Inject
  private PasswordService passwordService;

  @Inject
  private TokenService tokenService;

  @POST
  @Path("/register")
  @Transactional
  public Response register(RegisterRequest registerRequest) {
    if (!registerRequest.getPassword().equals(registerRequest.getRepeatPassword())) {
      return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\":\"As senhas não coincidem\"}").build();
    }
    try {
      em.createQuery("SELECT u FROM User u WHERE u.username = :username", User.class)
          .setParameter("username", registerRequest.getUsername())
          .getSingleResult();
      return Response.status(Response.Status.CONFLICT).entity("{\"error\":\"Usuário já existe\"}").build();
    } catch (NoResultException e) {
      User user = new User();
      user.setId(UUID.randomUUID().toString());
      user.setUsername(registerRequest.getUsername());
      user.setPassword(passwordService.hashPassword(registerRequest.getPassword()));
      em.persist(user);
      return Response.status(Response.Status.CREATED).build();
    }
  }

  @POST
  @Path("/login")
  @Transactional
  public Response login(LoginRequest loginRequest) {
    try {
      User user = em.createQuery("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:username)", User.class)
          .setParameter("username", loginRequest.getUsername())
          .getSingleResult();

      if (passwordService.checkPassword(loginRequest.getPassword(), user.getPassword())) {
        String token = tokenService.generateToken(user.getUsername());
        return Response.ok(new AuthResponse(token, user.getUsername())).build();
      }
    } catch (NoResultException ignored) {
    }

    return Response.status(Response.Status.UNAUTHORIZED).entity("{\"error\":\"Credenciais inválidas\"}").build();
  }
}