package com.findash.features.transaction;

import com.findash.core.common.BaseResource;
import com.findash.core.security.Secured;
import com.findash.features.user.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;

@Path("/transactions")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Secured
public class TransactionResource extends BaseResource {

  @GET
  public List<Transaction> getAll() {
    return em.createQuery("SELECT t FROM Transaction t WHERE t.user = :user ORDER BY t.date DESC", Transaction.class)
        .setParameter("user", getCurrentUser())
        .getResultList();
  }

  @POST
  @Transactional
  public Response create(Transaction transaction) {
    transaction.setId(UUID.randomUUID().toString());
    transaction.setUser(getCurrentUser());
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