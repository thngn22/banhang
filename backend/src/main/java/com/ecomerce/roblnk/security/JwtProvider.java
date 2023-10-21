package com.ecomerce.roblnk.security;

import com.ecomerce.roblnk.constants.JwtConstant;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtProvider {


    Key key = new SecretKeySpec(Base64.getDecoder().decode(JwtConstant.SECRET_KEY),
            SignatureAlgorithm.HS256.getJcaName());

    public String generateToken(Authentication authentication){
        return Jwts.builder()
                .claim("email", authentication.getName())
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(new Date(new Date().getTime() +  846000000))
                .signWith(key)
                .compact();
    }

    public String getEmailFromToken(String jwt){
        jwt = jwt.substring(7);
        Claims claims = Jwts.parser().setSigningKey(key).parseClaimsJws(jwt).getBody();
        String email = String.valueOf(claims.get("email"));
        return email;
    }
}
