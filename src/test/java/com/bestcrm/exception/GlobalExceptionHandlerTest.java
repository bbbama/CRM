package com.bestcrm.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void shouldHandleResourceNotFound() {
        ResponseEntity<Map<String, String>> response = handler.handleNotFound(
                new ResourceNotFoundException("Partner not found"));

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Partner not found", response.getBody().get("error"));
    }

    @Test
    void shouldHandleBadRequest() {
        ResponseEntity<Map<String, String>> response = handler.handleBadRequest(
                new IllegalArgumentException("Invalid input"));

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid input", response.getBody().get("error"));
    }

    @Test
    void shouldHandleAccessDenied() {
        ResponseEntity<Map<String, String>> response = handler.handleAccessDenied(
                new AccessDeniedException("Access denied"));

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Access denied", response.getBody().get("error"));
    }

    @Test
    void shouldHandleRuntime() {
        ResponseEntity<Map<String, String>> response = handler.handleRuntime(
                new RuntimeException("Unexpected error"));

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Unexpected error", response.getBody().get("error"));
    }
}
