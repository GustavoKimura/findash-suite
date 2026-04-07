package com.findash;

import com.findash.security.Secured;
import com.findash.user.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.List;
import java.util.UUID;

@Path("/transactions")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Secured
public class TransactionResource {

  @PersistenceContext
  private EntityManager em;

  @Context
  private SecurityContext securityContext;

  private User getCurrentUser() {
    String username = securityContext.getUserPrincipal().getName();
    try {
      return em.createQuery("SELECT u FROM User u WHERE u.username = :username", User.class)
          .setParameter("username", username)
          .getSingleResult();
    } catch (NoResultException e) {
      throw new WebApplicationException("User not found", Response.Status.UNAUTHORIZED);
    }
  }

  @GET
  public List<Transaction> getAll() {
    User user = getCurrentUser();
    return em.createQuery("SELECT t FROM Transaction t WHERE t.user = :user ORDER BY t.date DESC", Transaction.class)
        .setParameter("user", user)
        .getResultList();
  }

  @POST
  @Transactional
  public Response create(Transaction transaction) {
    User user = getCurrentUser();
    transaction.setId(UUID.randomUUID().toString());
    transaction.setUser(user);
    em.persist(transaction);
    return Response.status(Response.Status.CREATED).entity(transaction).build();
  }

  @PUT
  @Path("/{id}")
  @Transactional
  public Response update(@PathParam("id") String id, Transaction transaction) {
    User user = getCurrentUser();
    Transaction existing = em.find(Transaction.class, id);
    if (existing == null || !existing.getUser().getId().equals(user.getId())) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    transaction.setId(id);
    transaction.setUser(user);
    Transaction updated = em.merge(transaction);
    return Response.ok(updated).build();
  }

  @DELETE
  @Path("/{id}")
  @Transactional
  public Response delete(@PathParam("id") String id) {
    User user = getCurrentUser();
    Transaction existing = em.find(Transaction.class, id);
    if (existing == null || !existing.getUser().getId().equals(user.getId())) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    em.remove(existing);
    return Response.noContent().build();
  }
}