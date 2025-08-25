package com.banking.service;

import com.banking.dto.TransactionRequest;
import com.banking.dto.TransactionResponse;
import com.banking.model.Transaction;
import com.banking.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class TransactionGatewayService {
    
    @Autowired
    private TransactionProcessorService transactionProcessorService;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    /**
     * Process transaction request (System 1 - Gateway)
     * @param request The transaction request
     * @return Transaction response
     */
    public TransactionResponse processTransaction(TransactionRequest request) {
        // Basic validation
        if (!isValidCardNumber(request.getCardNumber())) {
            return createDeclinedResponse("Invalid card number format");
        }
        
        if (!isValidAmount(request.getAmount())) {
            return createDeclinedResponse("Invalid amount");
        }
        
        if (!isValidTransactionType(request.getType())) {
            return createDeclinedResponse("Invalid transaction type");
        }
        
        // Routing logic - only process cards starting with '4'
        if (!request.getCardNumber().startsWith("4")) {
            Transaction declinedTransaction = createDeclinedTransaction(request, "Card range not supported");
            transactionRepository.save(declinedTransaction);
            return createDeclinedResponse("Card range not supported");
        }
        
        // Route to System 2 for processing
        return transactionProcessorService.processTransaction(request);
    }
    
    /**
     * Validate card number format
     * @param cardNumber The card number to validate
     * @return true if valid, false otherwise
     */
    private boolean isValidCardNumber(String cardNumber) {
        return cardNumber != null && cardNumber.matches("^\\d{16}$");
    }
    
    /**
     * Validate amount
     * @param amount The amount to validate
     * @return true if valid, false otherwise
     */
    private boolean isValidAmount(BigDecimal amount) {
        return amount != null && amount.compareTo(BigDecimal.ZERO) > 0;
    }
    
    /**
     * Validate transaction type
     * @param type The transaction type to validate
     * @return true if valid, false otherwise
     */
    private boolean isValidTransactionType(String type) {
        return "withdraw".equals(type) || "topup".equals(type);
    }
    
    /**
     * Create a declined response
     * @param message The decline message
     * @return Transaction response
     */
    private TransactionResponse createDeclinedResponse(String message) {
        return new TransactionResponse(false, message);
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
} 