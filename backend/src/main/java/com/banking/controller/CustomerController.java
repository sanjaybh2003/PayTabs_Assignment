package com.banking.controller;

import com.banking.dto.TransactionRequest;
import com.banking.dto.TransactionResponse;
import com.banking.model.Card;
import com.banking.model.Transaction;
import com.banking.repository.CardRepository;
import com.banking.repository.TransactionRepository;
import com.banking.service.TransactionGatewayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private CardRepository cardRepository;
    
    @Autowired
    private TransactionGatewayService transactionGatewayService;
    
    /**
     * Get customer transactions by card number
     * @param cardNumber The card number
     * @return List of transactions for the card
     */
    @GetMapping("/transactions/{cardNumber}")
    public ResponseEntity<List<Transaction>> getCustomerTransactions(@PathVariable String cardNumber) {
        List<Transaction> transactions = transactionRepository.findByCardNumberOrderByTimestampDesc(cardNumber);
        return ResponseEntity.ok(transactions);
    }
    
    /**
     * Get card balance
     * @param cardNumber The card number
     * @return Card balance information
     */
    @GetMapping("/balance/{cardNumber}")
    public ResponseEntity<?> getCardBalance(@PathVariable String cardNumber) {
        Optional<Card> cardOptional = cardRepository.findByCardNumber(cardNumber);
        if (cardOptional.isPresent()) {
            Card card = cardOptional.get();
            return ResponseEntity.ok(new BalanceResponse(card.getCardNumber(), card.getBalance()));
        } else {
            return ResponseEntity.badRequest().body("Card not found");
        }
    }
    
    /**
     * Initiate top-up transaction
     * @param request The top-up request
     * @return Transaction response
     */
    @PostMapping("/topup")
    public ResponseEntity<TransactionResponse> initiateTopup(@Valid @RequestBody TransactionRequest request) {
        // Ensure this is a top-up request
        if (!"topup".equals(request.getType())) {
            return ResponseEntity.badRequest().body(new TransactionResponse(false, "Invalid transaction type for top-up"));
        }
        
        TransactionResponse response = transactionGatewayService.processTransaction(request);
        return ResponseEntity.ok(response);
    }
    
    // Inner class for balance response
    private static class BalanceResponse {
        private String cardNumber;
        private java.math.BigDecimal balance;
        
        public BalanceResponse(String cardNumber, java.math.BigDecimal balance) {
            this.cardNumber = cardNumber;
            this.balance = balance;
        }
        
        public String getCardNumber() {
            return cardNumber;
        }
        
        public void setCardNumber(String cardNumber) {
            this.cardNumber = cardNumber;
        }
        
        public java.math.BigDecimal getBalance() {
            return balance;
        }
        
        public void setBalance(java.math.BigDecimal balance) {
            this.balance = balance;
        }
    }
} 