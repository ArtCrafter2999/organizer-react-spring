package com.example.organizerspringapi.authorization;

import com.example.organizerspringapi.entities.User;
import com.example.organizerspringapi.repositories.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

public class AuthorizationInterceptor implements HandlerInterceptor {
    private final UserRepository userRepository;

    public AuthorizationInterceptor(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private HttpServletResponse response;

    @Override
    public boolean preHandle(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull Object handler){
        this.response = response;
        if (handler instanceof HandlerMethod handlerMethod) {
            Authorized authorizedAnnotation = handlerMethod.getMethod().getAnnotation(Authorized.class);
            if (authorizedAnnotation != null) {
                // Put your authorization logic here
                boolean isAuthorized = checkAuthorization(request);
                if (!isAuthorized) {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    return false;
                }
            }
        }
        return true;
    }

    private boolean checkAuthorization(@NotNull HttpServletRequest request) {
        // Implement your authorization logic here
        // You can check the JWT token or any other authentication mechanism
        // Return true if authorized, false otherwise
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            String jwtToken = token.substring(7); // Remove "Bearer " prefix
            // Perform token validation and authorization checks
            // Retrieve the user details from the token
            User user = getUserFromToken(jwtToken);
            if (user != null) {
                // Add the user details to the request attributes for further use in the controller
                request.setAttribute("user", user);
                return true; // Authorized
            }
        }
        return false; // Not authorized
    }

    private @Nullable User getUserFromToken(String token) {
        Long id = getUserIdFromToken(token);
        if (id == null) {
            response.setHeader("ErrorContent", "Id is null");
            return null;
        }
        Optional<User> optionalUser = userRepository.findById(id);
        User user = optionalUser.orElse(null);
        if (user == null) response.setHeader("ErrorContent", "Id isn't null ("+id+") but user is null");
        return user;
    }


    private @Nullable Long getUserIdFromToken(String token) {
        try {
            byte[] signingKey = SecretKeyHolder.SECRET_KEY.getBytes(StandardCharsets.UTF_8);
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(signingKey))
                    .build()
                    .parseClaimsJws(token);
            return Long.parseLong(claims.getBody().getSubject());
        } catch (Exception e) {
            return null;
        }
    }
}