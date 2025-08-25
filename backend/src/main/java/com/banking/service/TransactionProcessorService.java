package com.banking.service;

import com.banking.dto.TransactionRequest;
import com.banking.dto.TransactionResponse;
import com.banking.model.Card;
import com.banking.model.Transaction;
import com.banking.repository.CardRepository;
import com.banking.repository.TransactionRepository;
import com.banking.util.PinHasher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class TransactionProcessorService {
    
    @Autowired
    private CardRepository cardRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    /**
     * Process transaction (System 2 - Processor)
     * @param request The transaction request
     * @return Transaction response
     */
    @Transactional
    public TransactionResponse processTransaction(TransactionRequest request) {
        // Find the card
        Optional<Card> cardOptional = cardRepository.findByCardNumber(request.getCardNumber());
        if (cardOptional.isEmpty()) {
            Transaction declinedTransaction = createDeclinedTransaction(request, "Invalid card");
            transactionRepository.save(declinedTransaction);
            return new TransactionResponse(false, "Invalid card");
        }
        
        Card card = cardOptional.get();
        
        // Validate PIN
        if (!PinHasher.verifyPin(request.getPin(), card.getPinHash())) {
            Transaction declinedTransaction = createDeclinedTransaction(request, "Invalid PIN");
            transactionRepository.save(declinedTransaction);
            return new TransactionResponse(false, "Invalid PIN");
        }
        
        // Process transaction based on type
        if ("withdraw".equals(request.getType())) {
            return processWithdrawal(card, request);
        } else if ("topup".equals(request.getType())) {
            return processTopup(card, request);
        } else {
            Transaction declinedTransaction = createDeclinedTransaction(request, "Invalid transaction type");
            transactionRepository.save(declinedTransaction);
            return new TransactionResponse(false, "Invalid transaction type");
        }
    }
    
    /**
     * Process withdrawal transaction
     * @param card The card to withdraw from
     * @param request The transaction request
     * @return Transaction response
     */
    private TransactionResponse processWithdrawal(Card card, TransactionRequest request) {
        BigDecimal currentBalance = card.getBalance();
        BigDecimal withdrawalAmount = request.getAmount();
        
        // Check sufficient balance
        if (currentBalance.compareTo(withdrawalAmount) < 0) {
            Transaction declinedTransaction = createDeclinedTransaction(request, "Insufficient balance");
            transactionRepository.save(declinedTransaction);
            return new TransactionResponse(false, "Insufficient balance");
        }
        
        // Update balance
        BigDecimal newBalance = currentBalance.subtract(withdrawalAmount);
        card.setBalance(newBalance);
        cardRepository.save(card);
        
        // Create successful transaction record
        Transaction transaction = createSuccessfulTransaction(request, "Withdrawal successful");
        transaction.setBalanceAfter(newBalance);
        transactionRepository.save(transaction);
        
        return new TransactionResponse(true, "Withdrawal successful", 
            card.getCardNumber(), "withdraw", withdrawalAmount, newBalance);
    }
    
    /**
     * Process top-up transaction
     * @param card The card to top up
     * @param request The transaction request
     * @return Transaction response
     */
    private TransactionResponse processTopup(Card card, TransactionRequest request) {
        BigDecimal currentBalance = card.getBalance();
        BigDecimal topupAmount = request.getAmount();
        
        // Update balance
        BigDecimal newBalance = currentBalance.add(topupAmount);
        card.setBalance(newBalance);
        cardRepository.save(card);
        
        // Create successful transaction record
        Transaction transaction = createSuccessfulTransaction(request, "Top-up successful");
        transaction.setBalanceAfter(newBalance);
        transactionRepository.save(transaction);
        
        return new TransactionResponse(true, "Top-up successful", 
            card.getCardNumber(), "topup", topupAmount, newBalance);
    }
    
    /**
     * Create a declined transaction record
     * @param request The original request
     * @param message The decline message
     * @return Transaction entity
     */
    private Transaction createDeclinedTransaction(TransactionRequest request, String message) {
        Transaction transaction = new Transaction(
            request.getCardNumber(),
            "withdraw".equals(request.getType()) ? Transaction.TransactionType.WITHDRAW : Transaction.TransactionType.TOPUP,
            request.getAmount()
        );
        transaction.setStatus(Transaction.TransactionStatus.DECLINED);
        transaction.setMessage(message);
        return transaction;
    }
    
    /**
     * Create a successful transaction record
     * @param request The original request
     * @param message The success message
     * @return Transaction entity
     */
    private Transaction createSuccessfulTransaction(TransactionRequest request, String message) {
        Transaction transaction = new Transaction(
            request.getCardNumber(),
            "withdraw".equals(request.getType()) ? Transaction.TransactionType.WITHDRAW : Transaction.TransactionType.TOPUP,
            request.getAmount()
        );
        transaction.setStatus(Transaction.TransactionStatus.SUCCESS);
        transaction.setMessage(message);
        return transaction;
    }
} 