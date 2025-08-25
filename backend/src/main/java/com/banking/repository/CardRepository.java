package com.banking.repository;

import com.banking.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    
    /**
     * Find a card by its card number
     * @param cardNumber The card number to search for
     * @return Optional containing the card if found
     */
    Optional<Card> findByCardNumber(String cardNumber);
    
    /**
     * Check if a card exists by its card number
     * @param cardNumber The card number to check
     * @return true if the card exists, false otherwise
     */
    boolean existsByCardNumber(String cardNumber);
} 