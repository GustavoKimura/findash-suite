package com.findash.auth;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.enterprise.context.ApplicationScoped;

import java.text.ParseException;
import java.util.Date;
import java.util.Optional;

@ApplicationScoped
public class TokenService {

  private final String secret;
  private final String issuer;
  private final JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);

  public TokenService() {
    this.secret = Optional.ofNullable(System.getenv("JWT_SECRET"))
        .orElse("default-super-secret-key-that-is-long-enough");
    this.issuer = Optional.ofNullable(System.getenv("JWT_ISSUER")).orElse("findash-api");
  }

  public String generateToken(String username) {
    try {
      JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
          .subject(username)
          .issuer(this.issuer)
          .issueTime(new Date())
          .expirationTime(new Date(new Date().getTime() + 7200 * 1000))
          .build();

      SignedJWT signedJWT = new SignedJWT(header, claimsSet);
      JWSSigner signer = new MACSigner(secret.getBytes());
      signedJWT.sign(signer);

      return signedJWT.serialize();
    } catch (JOSEException e) {
      throw new RuntimeException("Error generating token", e);
    }
  }

  public Optional<String> getUsernameFromToken(String token) {
    try {
      SignedJWT signedJWT = SignedJWT.parse(token);
      JWSVerifier verifier = new MACVerifier(secret.getBytes());

      if (signedJWT.verify(verifier)) {
        JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
        Date expirationTime = claims.getExpirationTime();
        if (new Date().before(expirationTime)) {
          return Optional.of(claims.getSubject());
        }
      }
    } catch (ParseException | JOSEException e) {
      return Optional.empty();
    }
    return Optional.empty();
  }
}