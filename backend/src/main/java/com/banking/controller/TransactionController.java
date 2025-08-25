package com.banking.controller;

import com.banking.dto.TransactionRequest;
import com.banking.dto.TransactionResponse;
import com.banking.service.TransactionGatewayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {
    
    @Autowired
    private TransactionGatewayService transactionGatewayService;
    
    /**
     * System 1: Process transaction request
     * @param request The transaction request
     * @return Transaction response
     */
    @PostMapping("/transaction")
    public ResponseEntity<TransactionResponse> processTransaction(@Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = transactionGatewayService.processTransaction(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * System 2: Direct transaction processing (for internal use)
     * @param request The transaction request
     * @return Transaction response
     */
    @PostMapping("/process")
    public ResponseEntity<TransactionResponse> processTransactionDirect(@Valid @RequestBody TransactionRequest request) {
        // This endpoint is for direct processing (System 2)
        // In a real system, this would be called internally by System 1
        TransactionResponse response = transactionGatewayService.processTransaction(request);
        return ResponseEntity.ok(response);
    }
} 