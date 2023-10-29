package com.ecomerce.roblnk.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtService {

    @Value("${application.secret-key}")
    private String secretKey;

    @Value("${application.jwt.expiration}")
    private long jwtExpiration;

    @Value("${application.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }


    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String generateToken(UserDetails userDetails){
        /* Map<String, Object> claims = new HashMap<>();
        final Collection<? extends GrantedAuthority> roles =  userDetails.getAuthorities();
        List<String> list = new ArrayList<>();
        for (var authority : roles){
            list.add(authority.getAuthority());
        }
        claims.put("role", list);*/
        Map<String, Object> claims = Map.of("role", userDetails.getAuthorities().stream().map(Object::toString).toList());
        return buildToken(claims, userDetails, jwtExpiration);
    }
    public String generateRefreshToken(UserDetails userDetails){
        Map<String, Object> claims = Map.of("role", userDetails.getAuthorities().stream().map(Object::toString).toList());
        return buildToken(claims, userDetails, refreshExpiration);
    }

    public String buildToken(Map<String, Object> extraClaims,
                                UserDetails userDetails, long expirationTime){
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    public boolean isTokenValid(String token, UserDetails userDetails){
        try {
            final String email = extractEmail(token);
            return (email.equals(userDetails.getUsername())) && !isTokenExpired(token);
        } catch (SignatureException | MalformedJwtException | UnsupportedJwtException | IllegalArgumentException ex) {
            throw new BadCredentialsException("INVALID_CREDENTIALS", ex);
        } catch (ExpiredJwtException ex) {
            throw new JwtAuthenticationException("Token is expired!");
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }


    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    public String getEmailFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return String.valueOf(claims.get("email"));
    }
    public List<SimpleGrantedAuthority> getRolesFromToken(String token) {
        Claims claims = extractAllClaims(token);
        List<SimpleGrantedAuthority> roles = new ArrayList<>();
        List<?> rolesFromClaims = (List<?>) claims.get("role");

        if (rolesFromClaims != null) {
           for (var ro : rolesFromClaims){
               roles.add((SimpleGrantedAuthority) rolesFromClaims.get(rolesFromClaims.indexOf(ro)));
           }
        }

        return roles;

    }
}
