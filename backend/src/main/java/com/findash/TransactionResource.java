package com.findash;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/transactions")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TransactionResource {

  @PersistenceContext
  private EntityManager em;

  @GET
  public List<Transaction> getAll() {
    return em.createQuery("SELECT t FROM Transaction t ORDER BY t.date DESC", Transaction.class).getResultList();
  }

  @POST
  @Transactional
  public Response create(Transaction transaction) {
    transaction.setId(UUID.randomUUID().toString());
    em.persist(transaction);
    return Response.status(Response.Status.CREATED).entity(transaction).build();
  }

  @PUT
  @Path("/{id}")
  @Transactional
  public Response update(@PathParam("id") String id, Transaction transaction) {
    Transaction existing = em.find(Transaction.class, id);
    if (existing == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    transaction.setId(id);
    Transaction updated = em.merge(transaction);
    return Response.ok(updated).build();
  }

  @DELETE
  @Path("/{id}")
  @Transactional
  public Response delete(@PathParam("id") String id) {
    Transaction existing = em.find(Transaction.class, id);
    if (existing == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    em.remove(existing);
    return Response.noContent().build();
  }
}