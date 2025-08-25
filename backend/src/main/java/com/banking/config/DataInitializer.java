package com.banking.config;

import com.banking.model.Card;
import com.banking.model.User;
import com.banking.repository.CardRepository;
import com.banking.repository.UserRepository;
import com.banking.util.PinHasher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private CardRepository cardRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize test cards
        initializeCards();
        
        // Initialize test users
        initializeUsers();
    }
    
    private void initializeCards() {
        // Only create cards if they don't exist
        if (cardRepository.count() == 0) {
            // Card 1: Valid Visa card (starts with 4)
            Card card1 = new Card();
            card1.setCardNumber("4000123456789012");
            card1.setPinHash(PinHasher.hashPin("1234"));
            card1.setBalance(new BigDecimal("1000.00"));
            cardRepository.save(card1);
            
            // Card 2: Valid Visa card (starts with 4)
            Card card2 = new Card();
            card2.setCardNumber("4000123456789013");
            card2.setPinHash(PinHasher.hashPin("5678"));
            card2.setBalance(new BigDecimal("500.00"));
            cardRepository.save(card2);
            
            // Card 3: Unsupported card range (starts with 5)
            Card card3 = new Card();
            card3.setCardNumber("5000123456789012");
            card3.setPinHash(PinHasher.hashPin("9999"));
            card3.setBalance(new BigDecimal("2000.00"));
            cardRepository.save(card3);
            
            System.out.println("Test cards initialized:");
            System.out.println("- Card: 4000123456789012, PIN: 1234, Balance: 1000.00");
            System.out.println("- Card: 4000123456789013, PIN: 5678, Balance: 500.00");
            System.out.println("- Card: 5000123456789012, PIN: 9999, Balance: 2000.00 (unsupported range)");
        }
    }
    
    private void initializeUsers() {
        // Only create users if they don't exist
        if (userRepository.count() == 0) {
            // Super Admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.UserRole.ADMIN);
            userRepository.save(admin);
            
            // Customer user
            User customer = new User();
            customer.setUsername("customer");
            customer.setPassword(passwordEncoder.encode("customer123"));
            customer.setRole(User.UserRole.CUSTOMER);
            userRepository.save(customer);
            
            System.out.println("Test users initialized:");
            System.out.println("- Admin: username=admin, password=admin123");
            System.out.println("- Customer: username=customer, password=customer123");
        }
    }
} 