package com.findash.common;

import com.findash.user.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

public abstract class BaseResource {
  @PersistenceContext
  protected EntityManager em;

  @Context
  protected SecurityContext securityContext;

  protected User getCurrentUser() {
    if (securityContext == null || securityContext.getUserPrincipal() == null) {
      throw new WebApplicationException("Unauthorized", Response.Status.UNAUTHORIZED);
    }
    try {
      return em.createQuery("SELECT u FROM User u WHERE u.username = :username", User.class)
          .setParameter("username", securityContext.getUserPrincipal().getName())
          .getSingleResult();
    } catch (NoResultException e) {
      throw new WebApplicationException("User not found", Response.Status.UNAUTHORIZED);
    }
  }
}