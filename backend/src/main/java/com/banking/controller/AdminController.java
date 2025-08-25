package com.banking.controller;

import com.banking.model.Card;
import com.banking.model.Transaction;
import com.banking.repository.CardRepository;
import com.banking.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private CardRepository cardRepository;
    
    /**
     * Get all transactions (Super Admin view)
     * @return List of all transactions
     */
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        return ResponseEntity.ok(transactions);
    }
    
    /**
     * Get all cards (Super Admin view)
     * @return List of all cards
     */
    @GetMapping("/cards")
    public ResponseEntity<List<Card>> getAllCards() {
        List<Card> cards = cardRepository.findAll();
        return ResponseEntity.ok(cards);
    }
    
    /**
     * Get transactions by status
     * @param status The transaction status to filter by
     * @return List of transactions with the specified status
     */
    @GetMapping("/transactions/status/{status}")
    public ResponseEntity<List<Transaction>> getTransactionsByStatus(@PathVariable String status) {
        Transaction.TransactionStatus transactionStatus = Transaction.TransactionStatus.valueOf(status.toUpperCase());
        List<Transaction> transactions = transactionRepository.findByStatusOrderByTimestampDesc(transactionStatus);
        return ResponseEntity.ok(transactions);
    }
} 