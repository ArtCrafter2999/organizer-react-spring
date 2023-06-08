package com.example.organizerspringapi.authorization;

import java.security.SecureRandom;
import java.util.Base64;

public class SecretKeyHolder {
    public static final String SECRET_KEY;

    static {
        byte[] keyBytes = new byte[64];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(keyBytes);
        SECRET_KEY = Base64.getEncoder().encodeToString(keyBytes);
    }
}
