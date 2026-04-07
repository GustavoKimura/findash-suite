package com.findash.security;

import jakarta.enterprise.context.ApplicationScoped;
import org.mindrot.jbcrypt.BCrypt;

@ApplicationScoped
public class PasswordService {

  public String hashPassword(String plainTextPassword) {
    return BCrypt.hashpw(plainTextPassword, BCrypt.gensalt());
  }

  public boolean checkPassword(String plainTextPassword, String hashedPassword) {
    return BCrypt.checkpw(plainTextPassword, hashedPassword);
  }
}