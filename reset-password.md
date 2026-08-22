# Test Cases — Reset Password API (FR-03)

**Endpoint:** `POST /api/reset-password`  
**Base URL:** `http://localhost:3000`  
**Auth Required:** No

## API Specification

**Request Body:**
```json
{
  "email": "test@domain.com",
  "resetToken": "123456",
  "newPassword": "NewPassword123!"
}
```

---

## Test Case List

### TC-RP-001: Valid Reset Password Request
- **Priority:** P0 (Critical)
- **Category:** Happy Path
- **Description:** Valid email, token, and password should reset successfully
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 200 OK, success message
- **Test Data:** Valid email format, valid 6-digit token, password meeting complexity requirements

### TC-RP-002: Invalid Email Format — Missing @ Symbol
- **Priority:** P1 (High)
- **Category:** Domain Partition — Email
- **Description:** Email without @ symbol should be rejected
- **Request Body:**
  ```json
  {
    "email": "testdomain.com",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error
- **Test Data:** Invalid email format

### TC-RP-003: Invalid Email Format — Missing Domain
- **Priority:** P1 (High)
- **Category:** Domain Partition — Email
- **Description:** Email without domain should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-004: Invalid Email Format — Missing Local Part
- **Priority:** P1 (High)
- **Category:** Domain Partition — Email
- **Description:** Email without local part should be rejected
- **Request Body:**
  ```json
  {
    "email": "@domain.com",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-005: Empty Email Field
- **Priority:** P1 (High)
- **Category:** Domain Partition — Email
- **Description:** Empty email should be rejected
- **Request Body:**
  ```json
  {
    "email": "",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-006: Null Email Field
- **Priority:** P1 (High)
- **Category:** Domain Partition — Email
- **Description:** Null email should be rejected
- **Request Body:**
  ```json
  {
    "email": null,
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-007: SQL Injection in Email Field
- **Priority:** P0 (Critical)
- **Category:** Security — SQL Injection (SEC-01)
- **Description:** SQL injection payload should be sanitized and not execute
- **Request Body:**
  ```json
  {
    "email": "test@domain.com' OR '1'='1",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request or 200 with appropriate handling (no SQL execution)
- **Security Check:** Verify no SQL error in response, no data leakage

### TC-RP-008: SQL Injection with UNION Attack
- **Priority:** P0 (Critical)
- **Category:** Security — SQL Injection (SEC-01)
- **Description:** UNION-based SQL injection should be blocked
- **Request Body:**
  ```json
  {
    "email": "test@domain.com' UNION SELECT * FROM users--",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request (no data exposure)

### TC-RP-009: XSS Payload in Email Field
- **Priority:** P1 (High)
- **Category:** Security — XSS (SEC-02)
- **Description:** XSS payload should be sanitized
- **Request Body:**
  ```json
  {
    "email": "<script>alert('XSS')</script>@domain.com",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request or sanitized input

### TC-RP-010: Invalid Reset Token — Wrong Token Format (Letters)
- **Priority:** P1 (High)
- **Category:** Domain Partition — Reset Token
- **Description:** Non-numeric token should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "abcdef",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-011: Invalid Reset Token — Wrong Token Format (Special Characters)
- **Priority:** P1 (High)
- **Category:** Domain Partition — Reset Token
- **Description:** Token with special characters should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123@456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-012: Empty Reset Token
- **Priority:** P1 (High)
- **Category:** Domain Partition — Reset Token
- **Description:** Empty token should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-013: Null Reset Token
- **Priority:** P1 (High)
- **Category:** Domain Partition — Reset Token
- **Description:** Null token should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": null,
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-014: Expired Reset Token
- **Priority:** P0 (Critical)
- **Category:** State Transition — Token Expiry
- **Description:** Expired token should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "999999",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400/401 Bad Request with "expired" or "invalid" error
- **Prerequisite:** Token must be expired in test data

### TC-RP-015: Already Used Reset Token
- **Priority:** P0 (Critical)
- **Category:** State Transition — Token Reuse
- **Description:** Token already used for reset should not work again
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "111111",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400/401 Bad Request with "already used" error
- **Prerequisite:** Token must have been used before in test data

### TC-RP-016: Wrong Reset Token for Email
- **Priority:** P0 (Critical)
- **Category:** Security — IDOR (SEC-03)
- **Description:** Token generated for different email should not work
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "222222",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400/401 Bad Request with "invalid token" error
- **Security Check:** Token should be tied to specific email

### TC-RP-017: Invalid Password — Too Short (Less than 8 chars)
- **Priority:** P1 (High)
- **Category:** Domain Partition — Password Complexity
- **Description:** Password less than 8 characters should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": "Pass1!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-018: Invalid Password — Missing Uppercase Letter
- **Priority:** P1 (High)
- **Category:** Domain Partition — Password Complexity
- **Description:** Password without uppercase should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": "password123!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-019: Invalid Password — Missing Lowercase Letter
- **Priority:** P1 (High)
- **Category:** Domain Partition — Password Complexity
- **Description:** Password without lowercase should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": "PASSWORD123!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-020: Invalid Password — Missing Number
- **Priority:** P1 (High)
- **Category:** Domain Partition — Password Complexity
- **Description:** Password without number should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": "PasswordABC!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-021: Invalid Password — Missing Special Character
- **Priority:** P1 (High)
- **Category:** Domain Partition — Password Complexity
- **Description:** Password without special character should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": "Password1234"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-022: Empty Password Field
- **Priority:** P1 (High)
- **Category:** Domain Partition — Password
- **Description:** Empty password should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": ""
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-023: Null Password Field
- **Priority:** P1 (High)
- **Category:** Domain Partition — Password
- **Description:** Null password should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": null
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-024: SQL Injection in Password Field
- **Priority:** P0 (Critical)
- **Category:** Security — SQL Injection (SEC-01)
- **Description:** SQL injection in password should be sanitized
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": "Pass123!' OR '1'='1"
  }
  ```
- **Expected Response:** 400 Bad Request (password sanitized)

### TC-RP-025: XSS Payload in Password Field
- **Priority:** P1 (High)
- **Category:** Security — XSS (SEC-02)
- **Description:** XSS payload in password should be sanitized
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": "<script>alert(1)</script>Pass1!"
  }
  ```
- **Expected Response:** 400 Bad Request or sanitized input

### TC-RP-026: Missing Email Field (Malformed JSON)
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Request without email field should be rejected
- **Request Body:**
  ```json
  {
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-027: Missing Reset Token Field
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Request without token field should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-028: Missing New Password Field
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Request without password field should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456"
  }
  ```
- **Expected Response:** 400 Bad Request with validation error

### TC-RP-029: Extra Unknown Field in Request
- **Priority:** P2 (Medium)
- **Category:** Schema Validation
- **Description:** Extra fields should be ignored or cause validation error
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": "NewPassword123!",
    "extraField": "shouldBeIgnored"
  }
  ```
- **Expected Response:** 200 OK (extra fields ignored) or 400 (strict mode)

### TC-RP-030: Wrong Content-Type Header
- **Priority:** P2 (Medium)
- **Category:** Security — Content Type Validation (SEC-04)
- **Description:** Request with wrong content-type should be handled
- **Headers:** `Content-Type: text/plain`
- **Request Body:** Raw string instead of JSON
- **Expected Response:** 400 Bad Request or 415 Unsupported Media Type

### TC-RP-031: Non-Existent Email (User Not Found)
- **Priority:** P0 (Critical)
- **Category:** Security — Information Disclosure (SEC-05)
- **Description:** Attempting reset for non-existent user should not reveal user existence
- **Request Body:**
  ```json
  {
    "email": "nonexistent@domain.com",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** Generic error message (not "User not found")
- **Security Check:** Should not disclose whether email exists in system

### TC-RP-032: Password Same as Current Password
- **Priority:** P2 (Medium)
- **Category:** Business Logic
- **Description:** New password same as current password should be handled
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": "CurrentPassword123!"
  }
  ```
- **Expected Response:** 200 OK or 400 (depending on policy)

### TC-RP-033: Token Case Sensitivity
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — Token Format
- **Description:** Token with uppercase letters should be handled consistently
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123AbC",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** According to spec (numeric-only expected)

### TC-RP-034: Multiple Rapid Reset Attempts
- **Priority:** P1 (High)
- **Category:** Security — Rate Limiting (SEC-06)
- **Description:** Multiple rapid reset attempts should be rate limited
- **Request:** Send 10+ reset requests in quick succession
- **Expected Response:** 429 Too Many Requests after threshold
- **Security Check:** Verify rate limiting is enforced

### TC-RP-035: Invalid JSON Format
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Malformed JSON should be rejected
- **Request Body:** `{email: "test@domain.com", resetToken: "123456", newPassword: "Pass123!"}`
- **Expected Response:** 400 Bad Request (JSON parsing error)

### TC-RP-036: Very Long Email (>254 chars)
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — Email Length
- **Description:** Email exceeding RFC 5321 limit should be rejected
- **Request Body:**
  ```json
  {
    "email": "a@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 400 Bad Request

### TC-RP-037: Unicode Characters in Email
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — Email Format
- **Description:** Unicode in email should be handled according to policy
- **Request Body:**
  ```json
  {
    "email": "test@domain.com\u00e9",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 200 OK or 400 (depending on Unicode support)

### TC-RP-038: Password with Only Special Characters
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — Password Complexity
- **Description:** Password with only special characters should be rejected
- **Request Body:**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": "!@#$%^&*()"
  }
  ```
- **Expected Response:** 400 Bad Request

### TC-RP-039: Concurrent Reset Attempts with Same Token
- **Priority:** P1 (High)
- **Category:** Security — Race Condition (SEC-07)
- **Description:** Two simultaneous requests with same token should be handled atomically
- **Request:** Send 2 identical reset requests simultaneously
- **Expected Response:** Only one should succeed, other should fail with "token already used"

### TC-RP-040: Email with Trailing Whitespace
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — Email Trimming
- **Description:** Email with leading/trailing whitespace should be trimmed or rejected
- **Request Body:**
  ```json
  {
    "email": "  test@domain.com  ",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```
- **Expected Response:** 200 OK (trimmed) or 400 (rejected)

---

## Test Case Summary

| Category | Count |
|----------|-------|
| Domain Partition — Email | 7 |
| Domain Partition — Reset Token | 4 |
| Domain Partition — Password | 8 |
| Security — SQL Injection | 2 |
| Security — XSS | 2 |
| Security — IDOR | 1 |
| Security — Information Disclosure | 1 |
| Security — Rate Limiting | 1 |
| Security — Race Condition | 1 |
| Security — Content Type | 1 |
| Schema Validation | 4 |
| State Transition — Token Expiry | 1 |
| State Transition — Token Reuse | 1 |
| Business Logic | 1 |
| Happy Path | 1 |
| **Total** | **40** |

---

## Response Schema Validation

### Success Response (200 OK)
```json
{
  "message": "string"
}
```

### Error Response (400/401/429)
```json
{
  "error": "string"  // or "message": "string"
}
```

---

## Test Execution Notes

1. **Pre-request Setup:**
   - User must be registered and have requested password reset via `/api/forgot-password`
   - Valid `resetToken` should be obtained from forgot-password flow
   - Set `X-Student-Id` header in all requests

2. **Postman Variables:**
   ```
   {{baseUrl}} = http://localhost:3000
   {{studentId}} = <Your Student ID>
   ```

3. **Test Execution Order:**
   - Run TC-RP-001 first to verify basic functionality
   - Run security tests (TC-RP-007, TC-RP-008, TC-RP-024) carefully
   - Use Collection Runner for batch execution
