# Test Cases — Cart API (FR-05)

**Endpoint:** `POST /api/cart`  
**Base URL:** `http://localhost:3000`  
**Auth Required:** Yes (Bearer Token)

## API Specification

**Request Body:**
```json
{
  "id": 1,
  "name": "Product Name",
  "price": 99.99,
  "quantity": 2
}
```

**Response:** (Success — 200 OK)
```json
{
  "message": "Item added to cart",
  "cartItem": {
    "id": 1,
    "name": "Product Name",
    "price": 99.99,
    "quantity": 2
  }
}
```

---

## Test Case List

### TC-CART-001: Valid Cart Add Request
- **Priority:** P0 (Critical)
- **Category:** Happy Path
- **Description:** Valid product with all fields should be added to cart successfully
- **Request Body:**
  ```json
  {
    "id": 1,
    "name": "iPhone 15 Pro",
    "price": 999.99,
    "quantity": 1
  }
  ```
- **Expected Response:** 200 OK with "Item added to cart" message
- **Test Data:** Valid integer id, valid string name, positive price, positive integer quantity

### TC-CART-002: Price Zero
- **Priority:** P1 (High)
- **Category:** Domain Partition — Price
- **Description:** Price of 0 should be handled according to policy
- **Request Body:**
  ```json
  {
    "id": 2,
    "name": "Free Sample",
    "price": 0,
    "quantity": 1
  }
  ```
- **Expected Response:** 200 OK (free items allowed) or 400 (price must be > 0)
- **Business Rule:** Depends on cart policy for zero-price items

### TC-CART-003: Negative Price
- **Priority:** P0 (Critical)
- **Category:** Domain Partition — Price
- **Description:** Negative price should be rejected
- **Request Body:**
  ```json
  {
    "id": 3,
    "name": "Discount Item",
    "price": -10.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request with validation error
- **Test Data:** price < 0

### TC-CART-004: Very Large Price (Exceeds Maximum)
- **Priority:** P1 (High)
- **Category:** Domain Partition — Price
- **Description:** Price exceeding system maximum should be rejected
- **Request Body:**
  ```json
  {
    "id": 4,
    "name": "Expensive Item",
    "price": 999999999.99,
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-CART-005: Price with Too Many Decimal Places
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — Price
- **Description:** Price with more than 2 decimal places should be handled
- **Request Body:**
  ```json
  {
    "id": 5,
    "name": "Precise Item",
    "price": 10.999,
    "quantity": 1
  }
  ```
- **Expected Response:** 200 OK (truncated) or 400 (validation error)

### TC-CART-006: Negative Quantity
- **Priority:** P0 (Critical)
- **Category:** Domain Partition — Quantity
- **Description:** Negative quantity should be rejected
- **Request Body:**
  ```json
  {
    "id": 6,
    "name": "Test Product",
    "price": 50.00,
    "quantity": -5
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-CART-007: Zero Quantity
- **Priority:** P1 (High)
- **Category:** Domain Partition — Quantity
- **Description:** Zero quantity should be rejected or ignored
- **Request Body:**
  ```json
  {
    "id": 7,
    "name": "Test Product",
    "price": 50.00,
    "quantity": 0
  }
  ```
- **Expected Response:** 400 Bad Request or quantity treated as invalid

### TC-CART-008: Very Large Quantity
- **Priority:** P1 (High)
- **Category:** Domain Partition — Quantity
- **Description:** Quantity exceeding stock limit should be handled
- **Request Body:**
  ```json
  {
    "id": 8,
    "name": "Bulk Product",
    "price": 10.00,
    "quantity": 999999
  }
  ```
- **Expected Response:** 400 Bad Request or 200 with capped quantity

### TC-CART-009: Quantity as Decimal/Float
- **Priority:** P1 (High)
- **Category:** Domain Partition — Quantity
- **Description:** Decimal quantity should be rejected (integers only)
- **Request Body:**
  ```json
  {
    "id": 9,
    "name": "Test Product",
    "price": 25.00,
    "quantity": 1.5
  }
  ```
- **Expected Response:** 400 Bad Request (quantity must be integer)

### TC-CART-010: Empty Product ID
- **Priority:** P1 (High)
- **Category:** Domain Partition — ID
- **Description:** Empty ID should be rejected
- **Request Body:**
  ```json
  {
    "id": "",
    "name": "Test Product",
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-CART-011: Null Product ID
- **Priority:** P1 (High)
- **Category:** Domain Partition — ID
- **Description:** Null ID should be rejected
- **Request Body:**
  ```json
  {
    "id": null,
    "name": "Test Product",
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-CART-012: Non-Numeric ID
- **Priority:** P1 (High)
- **Category:** Domain Partition — ID
- **Description:** Non-numeric ID should be rejected
- **Request Body:**
  ```json
  {
    "id": "abc123",
    "name": "Test Product",
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-CART-013: Empty Product Name
- **Priority:** P1 (High)
- **Category:** Domain Partition — Name
- **Description:** Empty name should be rejected
- **Request Body:**
  ```json
  {
    "id": 10,
    "name": "",
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-CART-014: Null Product Name
- **Priority:** P1 (High)
- **Category:** Domain Partition — Name
- **Description:** Null name should be rejected
- **Request Body:**
  ```json
  {
    "id": 11,
    "name": null,
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-CART-015: Very Long Product Name
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — Name
- **Description:** Name exceeding max length should be handled
- **Request Body:**
  ```json
  {
    "id": 12,
    "name": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 200 OK (truncated) or 400 (exceeds max length)

### TC-CART-016: XSS Payload in Product Name
- **Priority:** P0 (Critical)
- **Category:** Security — XSS (SEC-02)
- **Description:** XSS payload in name should be sanitized
- **Request Body:**
  ```json
  {
    "id": 13,
    "name": "<script>alert('XSS')</script>",
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request or sanitized input (no script execution)

### TC-CART-017: SQL Injection in Product Name
- **Priority:** P0 (Critical)
- **Category:** Security — SQL Injection (SEC-01)
- **Description:** SQL injection in name should be sanitized
- **Request Body:**
  ```json
  {
    "id": 14,
    "name": "Product'; DROP TABLE cart;--",
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request (no SQL execution)

### TC-CART-018: SQL Injection in ID Field
- **Priority:** P0 (Critical)
- **Category:** Security — SQL Injection (SEC-01)
- **Description:** SQL injection in ID should be sanitized
- **Request Body:**
  ```json
  {
    "id": "1 OR 1=1",
    "name": "Test Product",
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request (no SQL execution)

### TC-CART-019: Missing ID Field
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Request without ID field should be rejected
- **Request Body:**
  ```json
  {
    "name": "Test Product",
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-CART-020: Missing Name Field
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Request without name field should be rejected
- **Request Body:**
  ```json
  {
    "id": 15,
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-CART-021: Missing Price Field
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Request without price field should be rejected
- **Request Body:**
  ```json
  {
    "id": 16,
    "name": "Test Product",
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-CART-022: Missing Quantity Field
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Request without quantity field should be rejected
- **Request Body:**
  ```json
  {
    "id": 17,
    "name": "Test Product",
    "price": 25.00
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-CART-023: Extra Unknown Field in Request
- **Priority:** P2 (Medium)
- **Category:** Schema Validation
- **Description:** Extra fields should be ignored or cause validation error
- **Request Body:**
  ```json
  {
    "id": 18,
    "name": "Test Product",
    "price": 25.00,
    "quantity": 1,
    "extraField": "shouldBeIgnored"
  }
  ```
- **Expected Response:** 200 OK (extra fields ignored) or 400 (strict mode)

### TC-CART-024: No Authentication Token
- **Priority:** P0 (Critical)
- **Category:** Security — Authentication (SEC-03)
- **Description:** Request without auth token should be rejected
- **Headers:** No `Authorization` header
- **Expected Response:** 401 Unauthorized

### TC-CART-025: Invalid Authentication Token Format
- **Priority:** P0 (Critical)
- **Category:** Security — Authentication (SEC-03)
- **Description:** Request with malformed token should be rejected
- **Headers:** `Authorization: InvalidToken`
- **Expected Response:** 401 Unauthorized

### TC-CART-026: Expired Authentication Token
- **Priority:** P0 (Critical)
- **Category:** Security — Authentication (SEC-03)
- **Description:** Request with expired token should be rejected
- **Headers:** `Authorization: Bearer <expired_token>`
- **Expected Response:** 401 Unauthorized

### TC-CART-027: SQL Injection via Price Parameter
- **Priority:** P0 (Critical)
- **Category:** Security — SQL Injection (SEC-01)
- **Description:** SQL injection via price should be sanitized
- **Request Body:**
  ```json
  {
    "id": 19,
    "name": "Test Product",
    "price": "50; DROP TABLE users;--",
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request (type coercion or validation)

### TC-CART-028: SQL Injection via Quantity Parameter
- **Priority:** P0 (Critical)
- **Category:** Security — SQL Injection (SEC-01)
- **Description:** SQL injection via quantity should be sanitized
- **Request Body:**
  ```json
  {
    "id": 20,
    "name": "Test Product",
    "price": 25.00,
    "quantity": "1; DELETE FROM cart;--"
  }
  ```
- **Expected Response:** 400 Bad Request (type coercion or validation)

### TC-CART-029: Price as String Instead of Number
- **Priority:** P1 (High)
- **Category:** Domain Partition — Price
- **Description:** String price should be rejected
- **Request Body:**
  ```json
  {
    "id": 21,
    "name": "Test Product",
    "price": "fifty",
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request with type error

### TC-CART-030: Quantity as String Instead of Number
- **Priority:** P1 (High)
- **Category:** Domain Partition — Quantity
- **Description:** String quantity should be rejected
- **Request Body:**
  ```json
  {
    "id": 22,
    "name": "Test Product",
    "price": 25.00,
    "quantity": "one"
  }
  ```
- **Expected Response:** 400 Bad Request with type error

### TC-CART-031: Invalid JSON Format
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Malformed JSON should be rejected
- **Request Body:** `{id: 23, name: "Test", price: 25, quantity: 1}`
- **Expected Response:** 400 Bad Request (JSON parsing error)

### TC-CART-032: Empty Request Body
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Empty body should be rejected
- **Request Body:** `{}`
- **Expected Response:** 400 Bad Request with validation error

### TC-CART-033: Non-Existent Product ID
- **Priority:** P1 (High)
- **Category:** Business Logic
- **Description:** Adding non-existent product should be handled
- **Request Body:**
  ```json
  {
    "id": 999999,
    "name": "Non-existent Product",
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 200 OK (added anyway) or 404 (product not found)

### TC-CART-034: Adding Same Product Twice
- **Priority:** P1 (High)
- **Category:** State Transition — Cart State
- **Description:** Adding existing product should update quantity
- **Request 1:**
  ```json
  {
    "id": 24,
    "name": "Test Product",
    "price": 25.00,
    "quantity": 2
  }
  ```
- **Request 2:**
  ```json
  {
    "id": 24,
    "name": "Test Product",
    "price": 25.00,
    "quantity": 3
  }
  ```
- **Expected Response:** Quantity should be summed or overwritten (verify behavior)

### TC-CART-035: Price Mismatch with Server
- **Priority:** P2 (Medium)
- **Category:** Business Logic
- **Description:** Client price differs from server price
- **Request Body:**
  ```json
  {
    "id": 25,
    "name": "Product A",
    "price": 10.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 200 OK (server may use its own price) or error if strict validation

### TC-CART-036: Unicode Characters in Product Name
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — Name
- **Description:** Unicode in name should be handled
- **Request Body:**
  ```json
  {
    "id": 26,
    "name": "Sản Phẩm Tiếng Việt",
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 200 OK or 400 (depending on Unicode support)

### TC-CART-037: Duplicate Cart Item (Same ID, Different Name)
- **Priority:** P2 (Medium)
- **Category:** Business Logic
- **Description:** Same ID with different name should be handled
- **Request Body:**
  ```json
  {
    "id": 27,
    "name": "Different Name",
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 200 OK (behavior depends on server logic)

### TC-CART-038: Missing Authorization Header (Bearer Prefix)
- **Priority:** P0 (Critical)
- **Category:** Security — Authentication (SEC-03)
- **Description:** Token without Bearer prefix should be rejected
- **Headers:** `Authorization: some_token_without_bearer`
- **Expected Response:** 401 Unauthorized

### TC-CART-039: Special Characters in Product Name
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — Name
- **Description:** Special characters should be allowed or rejected
- **Request Body:**
  ```json
  {
    "id": 28,
    "name": "Product @#$%^&*()",
    "price": 25.00,
    "quantity": 1
  }
  ```
- **Expected Response:** 200 OK (allowed) or 400 (special chars not allowed)

### TC-CART-040: Floating Point Precision in Price
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — Price
- **Description:** Floating point issues should be handled
- **Request Body:**
  ```json
  {
    "id": 29,
    "name": "Precise Product",
    "price": 0.1 + 0.2,
    "quantity": 1
  }
  ```
- **Expected Response:** 200 OK with 0.3 or validation error for precision

### TC-CART-041: Very Small Positive Price
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — Price
- **Description:** Minimum price value should be handled
- **Request Body:**
  ```json
  {
    "id": 30,
    "name": "Cheap Product",
    "price": 0.01,
    "quantity": 1
  }
  ```
- **Expected Response:** 200 OK (minimum price accepted)

### TC-CART-042: Negative Price via Type Coercion
- **Priority:** P0 (Critical)
- **Category:** Security — Input Validation (SEC-04)
- **Description:** Negative price via string should be rejected
- **Request Body:**
  ```json
  {
    "id": 31,
    "name": "Test Product",
    "price": "-10.00",
    "quantity": 1
  }
  ```
- **Expected Response:** 400 Bad Request (string to number coercion + validation)

### TC-CART-043: No Bearer Token (Basic Auth Instead)
- **Priority:** P1 (High)
- **Category:** Security — Authentication (SEC-03)
- **Description:** Wrong auth type should be rejected
- **Headers:** `Authorization: Basic dXNlcjpwYXNz`
- **Expected Response:** 401 Unauthorized

### TC-CART-044: Concurrent Add to Cart
- **Priority:** P1 (High)
- **Category:** Security — Race Condition (SEC-07)
- **Description:** Multiple simultaneous adds should be handled atomically
- **Request:** Send 5 identical add-to-cart requests simultaneously
- **Expected Response:** All succeed or appropriate error handling

### TC-CART-045: Stock Limit Exceeded
- **Priority:** P1 (High)
- **Category:** Business Logic
- **Description:** Adding more than available stock should be handled
- **Prerequisite:** Product has limited stock
- **Request Body:**
  ```json
  {
    "id": 32,
    "name": "Limited Stock Product",
    "price": 100.00,
    "quantity": 1000
  }
  ```
- **Expected Response:** 200 OK (capped) or 400 (exceeds available stock)

---

## Test Case Summary

| Category | Count |
|----------|-------|
| Domain Partition — Price | 6 |
| Domain Partition — Quantity | 4 |
| Domain Partition — ID | 3 |
| Domain Partition — Name | 4 |
| Security — SQL Injection | 4 |
| Security — XSS | 1 |
| Security — Authentication | 4 |
| Security — Input Validation | 1 |
| Security — Race Condition | 1 |
| Schema Validation | 6 |
| Business Logic | 5 |
| State Transition — Cart State | 1 |
| Happy Path | 1 |
| **Total** | **45** |

---

## Response Schema Validation

### Success Response (200 OK)
```json
{
  "message": "string",
  "cartItem": {
    "id": "number",
    "name": "string",
    "price": "number",
    "quantity": "number"
  }
}
```

### Error Response (400/401/404)
```json
{
  "error": "string"  // or "message": "string"
}
```

---

## Test Execution Notes

1. **Pre-request Setup:**
   - User must be logged in and have valid JWT token
   - Test products should be pre-created in database
   - Set `Authorization: Bearer {{token}}` header
   - Set `X-Student-Id` header in all requests

2. **Postman Variables:**
   ```
   {{baseUrl}} = http://localhost:3000
   {{studentId}} = <Your Student ID>
   {{authToken}} = <JWT token from login>
   ```

3. **Test Execution Order:**
   - Run TC-CART-001 first to verify basic functionality
   - Run authentication tests (TC-CART-024 to TC-CART-026) to verify auth
   - Run security tests (TC-CART-016 to TC-CART-018, TC-CART-027 to TC-CART-028)
   - Use Collection Runner for batch execution

4. **State Management:**
   - Clear cart before running tests to ensure clean state
   - Some tests require specific pre-existing cart state
