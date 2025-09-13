package com.achcar_solutions.easycomm_api.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.achcar_solutions.easycomm_core.entities.authuser.AuthUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String apiSecret;

    public String generateToken(AuthUser authUser) {
        try {
            Algorithm encryptionAlgorithm = Algorithm.HMAC256(apiSecret);
            String token = JWT.create()
                    .withIssuer("certifica-ufu")
                    .withSubject(authUser.getEmail())
                    .withClaim("role", authUser.getRole().name())
                    .withClaim("name", authUser.getName())
                    .withExpiresAt(generateExpirationDate())
                    .sign(encryptionAlgorithm);
            return token;
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Error while generating token", exception);
        }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }

    public String validateToken(String token) {
        try {
            Algorithm encryptionAlgorithm = Algorithm.HMAC256(apiSecret);
            return JWT.require(encryptionAlgorithm)
                    .withIssuer("certifica-ufu")
                    .build()
                    .verify(token)
                    .getSubject();
        }catch (JWTVerificationException exception) {
            return "";
        }

    }
}
