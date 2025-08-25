package com.banking.repository;

import com.banking.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    /**
     * Find all transactions for a specific card
     * @param cardNumber The card number to search for
     * @return List of transactions for the card
     */
    List<Transaction> findByCardNumberOrderByTimestampDesc(String cardNumber);
    
    /**
     * Find all transactions by status
     * @param status The transaction status to search for
     * @return List of transactions with the specified status
     */
    List<Transaction> findByStatusOrderByTimestampDesc(Transaction.TransactionStatus status);
} 