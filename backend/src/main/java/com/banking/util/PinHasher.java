package com.banking.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class PinHasher {
    
    private static final String HASH_ALGORITHM = "SHA-256";
    
    /**
     * Hash a PIN using SHA-256
     * @param pin The plain text PIN to hash
     * @return The hashed PIN as a hexadecimal string
     */
    public static String hashPin(String pin) {
        try {
            MessageDigest digest = MessageDigest.getInstance(HASH_ALGORITHM);
            byte[] hash = digest.digest(pin.getBytes());
            return bytesToHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
    
    /**
     * Verify a PIN by comparing the hashed input with the stored hash
     * @param inputPin The plain text PIN to verify
     * @param storedHash The stored hash to compare against
     * @return true if the PIN matches, false otherwise
     */
    public static boolean verifyPin(String inputPin, String storedHash) {
        String inputHash = hashPin(inputPin);
        return inputHash.equals(storedHash);
    }
    
    /**
     * Convert byte array to hexadecimal string
     * @param bytes The byte array to convert
     * @return The hexadecimal string representation
     */
    private static String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
    
    /**
     * Generate a random salt for additional security (if needed in future)
     * @return A random salt string
     */
    public static String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return bytesToHex(salt);
    }
} 