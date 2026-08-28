# Test Cases - Forgot Password API (FR-03)

**Endpoint:** `POST /api/forgot-password`  
**Base URL:** `http://localhost:3000`  
**Auth Required:** No  
**Source checked:** `eshop-sut/api_specification.md`, `eshop-sut/backend/server.js`, `eshop-sut/backend/database.js`

## API Specification

**Request Body:**
```json
{
  "email": "test@domain.com"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Ma dat lai mat khau da duoc tao",
  "resetToken": "1234"
}
```

**Seeded Users:** `admin@eshop.com`, `lgbao23@clc.fitus.edu.vn`, `test@eshop.com`

## Test Case List

### TC-FP-001: Valid Forgot Password Request
- **Priority:** P0
- **Category:** Happy Path
- **Description:** Valid seeded user email should generate reset token successfully
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com"
  }
  ```
- **Expected Response:** 200 OK
- **Notes:** Success response includes message and resetToken.

### TC-FP-002: Valid Admin Email
- **Priority:** P1
- **Category:** Domain Partition - Existing Email
- **Description:** Seeded admin account can request forgot-password token
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "admin@eshop.com"
  }
  ```
- **Expected Response:** 200 OK
- **Notes:** Uses seeded admin@eshop.com from database.js.

### TC-FP-003: Valid Student Email
- **Priority:** P1
- **Category:** Domain Partition - Existing Email
- **Description:** Seeded student/admin email can request forgot-password token
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "lgbao23@clc.fitus.edu.vn"
  }
  ```
- **Expected Response:** 200 OK
- **Notes:** Uses seeded lgbao23@clc.fitus.edu.vn from database.js.

### TC-FP-004: Invalid Email Missing At Symbol
- **Priority:** P1
- **Category:** Domain Partition - Email Format
- **Description:** Email without @ should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "testeshop.com"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Invalid email syntax.

### TC-FP-005: Invalid Email Missing Domain
- **Priority:** P1
- **Category:** Domain Partition - Email Format
- **Description:** Email without domain should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Invalid email syntax.

### TC-FP-006: Invalid Email Missing Local Part
- **Priority:** P1
- **Category:** Domain Partition - Email Format
- **Description:** Email without local part should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "@eshop.com"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Invalid email syntax.

### TC-FP-007: Empty Email
- **Priority:** P1
- **Category:** Domain Partition - Email
- **Description:** Empty email should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": ""
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Required field is empty.

### TC-FP-008: Null Email
- **Priority:** P1
- **Category:** Domain Partition - Email
- **Description:** Null email should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": null
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Required field has null value.

### TC-FP-009: Missing Email Field
- **Priority:** P1
- **Category:** Schema Validation
- **Description:** Request body without email should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {}
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Required email field is missing.

### TC-FP-010: Email As Number
- **Priority:** P1
- **Category:** Schema Validation
- **Description:** Numeric email should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": 12345
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Email must be a string.

### TC-FP-011: Email As Boolean
- **Priority:** P2
- **Category:** Schema Validation
- **Description:** Boolean email should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": true
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Email must be a string.

### TC-FP-012: Email As Array
- **Priority:** P2
- **Category:** Schema Validation
- **Description:** Array email should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": [
      "test@eshop.com"
    ]
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Email must be a string.

### TC-FP-013: Email As Object
- **Priority:** P2
- **Category:** Schema Validation
- **Description:** Object email should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": {
      "value": "test@eshop.com"
    }
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Email must be a string.

### TC-FP-014: Non Existent Email
- **Priority:** P0
- **Category:** Security - Information Disclosure
- **Description:** Non-existent email should be handled consistently without account enumeration
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "notfound@eshop.com"
  }
  ```
- **Expected Response:** 404 Not Found
- **Notes:** Current API returns 404 User not found; report as potential SEC-05 bug.

### TC-FP-015: SQL Injection In Email
- **Priority:** P0
- **Category:** Security - SQL Injection (SEC-01)
- **Description:** SQL injection payload in email must not execute
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com' OR '1'='1"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Should be rejected or safely parameterized.

### TC-FP-016: UNION SQL Injection In Email
- **Priority:** P0
- **Category:** Security - SQL Injection (SEC-01)
- **Description:** UNION-based SQL injection payload must not expose data
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com' UNION SELECT * FROM users--"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Should not expose SQL errors or rows.

### TC-FP-017: XSS Payload In Email
- **Priority:** P1
- **Category:** Security - XSS (SEC-02)
- **Description:** Script payload in email should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "<script>alert('XSS')</script>@eshop.com"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Should not echo executable content.

### TC-FP-018: HTML Injection In Email
- **Priority:** P1
- **Category:** Security - XSS (SEC-02)
- **Description:** HTML payload in email should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "<b>test</b>@eshop.com"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Input should be validated as email.

### TC-FP-019: Command Injection String
- **Priority:** P1
- **Category:** Security - Input Validation (SEC-04)
- **Description:** Command-like payload should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com; rm -rf /"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Should be treated as invalid email.

### TC-FP-020: Email With Leading Trailing Spaces
- **Priority:** P2
- **Category:** Domain Partition - Email Trimming
- **Description:** Email with surrounding whitespace should be trimmed or rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "  test@eshop.com  "
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Chosen policy: reject untrimmed email input.

### TC-FP-021: Email With Internal Space
- **Priority:** P2
- **Category:** Domain Partition - Email Format
- **Description:** Email containing spaces should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test user@eshop.com"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Invalid email syntax.

### TC-FP-022: Uppercase Email
- **Priority:** P2
- **Category:** Domain Partition - Email Case
- **Description:** Email case handling should be consistent
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "TEST@ESHOP.COM"
  }
  ```
- **Expected Response:** 200 OK
- **Notes:** Chosen policy: email lookup should be case-insensitive.

### TC-FP-023: Plus Alias Email
- **Priority:** P2
- **Category:** Domain Partition - Email Format
- **Description:** Plus alias email format should be accepted if account exists
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test+reset@eshop.com"
  }
  ```
- **Expected Response:** 404 Not Found
- **Notes:** Valid format but not in seeded database.

### TC-FP-024: Subdomain Email
- **Priority:** P2
- **Category:** Domain Partition - Email Format
- **Description:** Subdomain email format should be accepted if account exists
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "user@mail.eshop.com"
  }
  ```
- **Expected Response:** 404 Not Found
- **Notes:** Valid format but not in seeded database.

### TC-FP-025: Unicode Email
- **Priority:** P2
- **Category:** Domain Partition - Email Format
- **Description:** Unicode email should follow system policy
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "t?st@eshop.com"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Chosen policy: reject non-ASCII email.

### TC-FP-026: Very Long Email
- **Priority:** P2
- **Category:** Domain Partition - Email Length
- **Description:** Email longer than 254 chars should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@eshop.com"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Exceeds common email length limit.

### TC-FP-027: Max Length Valid Format Not Existing
- **Priority:** P2
- **Category:** Domain Partition - Email Length
- **Description:** Near-limit valid email should not crash
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com"
  }
  ```
- **Expected Response:** 404 Not Found
- **Notes:** Valid format but account absent.

### TC-FP-028: Extra Unknown Field
- **Priority:** P2
- **Category:** Schema Validation
- **Description:** Extra fields should be ignored or rejected consistently
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com",
    "extraField": "ignored"
  }
  ```
- **Expected Response:** 200 OK
- **Notes:** Chosen policy: extra fields ignored.

### TC-FP-029: Empty Body
- **Priority:** P1
- **Category:** Schema Validation
- **Description:** Empty JSON body should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {}
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** No email provided.

### TC-FP-030: Invalid JSON Format
- **Priority:** P1
- **Category:** Schema Validation
- **Description:** Malformed JSON should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:** `{email: "test@eshop.com"}`
- **Expected Response:** 400 Bad Request
- **Notes:** JSON parsing error.

### TC-FP-031: Wrong Content Type Text Plain
- **Priority:** P2
- **Category:** Security - Content Type Validation (SEC-04)
- **Description:** text/plain request should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: text/plain`
  - `X-Student-Id: {{studentId}}`
- **Request Body:** `test@eshop.com`
- **Expected Response:** 400 Bad Request
- **Notes:** Endpoint expects application/json.

### TC-FP-032: Missing Content Type
- **Priority:** P2
- **Category:** Schema Validation
- **Description:** Request without content-type should be rejected
- **Method:** POST
- **Headers:**
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Endpoint expects JSON Content-Type.

### TC-FP-033: Authorization Header Present
- **Priority:** P2
- **Category:** Authentication Boundary
- **Description:** Forgot password should not require auth but should tolerate irrelevant auth header
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
  - `Authorization: Bearer {{authToken}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com"
  }
  ```
- **Expected Response:** 200 OK
- **Notes:** No auth required per API spec.

### TC-FP-034: Invalid Authorization Header Present
- **Priority:** P2
- **Category:** Authentication Boundary
- **Description:** Invalid auth header should not block public forgot-password endpoint
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
  - `Authorization: InvalidToken`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com"
  }
  ```
- **Expected Response:** 200 OK
- **Notes:** No auth required per API spec.

### TC-FP-035: GET Wrong Method
- **Priority:** P1
- **Category:** HTTP Method Validation
- **Description:** GET method should not be allowed
- **Method:** GET
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com"
  }
  ```
- **Expected Response:** 404 Not Found
- **Notes:** Only POST is specified.

### TC-FP-036: PUT Wrong Method
- **Priority:** P1
- **Category:** HTTP Method Validation
- **Description:** PUT method should not be allowed
- **Method:** PUT
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com"
  }
  ```
- **Expected Response:** 404 Not Found
- **Notes:** Only POST is specified.

### TC-FP-037: DELETE Wrong Method
- **Priority:** P1
- **Category:** HTTP Method Validation
- **Description:** DELETE method should not be allowed
- **Method:** DELETE
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com"
  }
  ```
- **Expected Response:** 404 Not Found
- **Notes:** Only POST is specified.

### TC-FP-038: Success Response Schema
- **Priority:** P1
- **Category:** Schema Validation
- **Description:** Successful response should contain message and resetToken
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com"
  }
  ```
- **Expected Response:** 200 OK
- **Notes:** Response schema: message string, resetToken string.

### TC-FP-039: Error Response Schema
- **Priority:** P1
- **Category:** Schema Validation
- **Description:** Error response should contain error or message
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "notfound@eshop.com"
  }
  ```
- **Expected Response:** 404 Not Found
- **Notes:** Error schema: error/message string.

### TC-FP-040: Multiple Rapid Forgot Password Attempts
- **Priority:** P1
- **Category:** Security - Rate Limiting (SEC-06)
- **Description:** Many forgot-password requests should eventually be rate limited
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com"
  }
  ```
- **Expected Response:** 429 Too Many Requests
- **Notes:** Expected rate limit after repeated attempts; useful to reveal missing rate limit.

### TC-FP-041: Concurrent Forgot Password Requests
- **Priority:** P1
- **Category:** Security - Race Condition (SEC-07)
- **Description:** Concurrent token generation should keep a consistent final token state
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com"
  }
  ```
- **Expected Response:** 200 OK
- **Notes:** Single probe for concurrent/race-condition scenario.

### TC-FP-042: Email Newline Injection
- **Priority:** P1
- **Category:** Security - Header Injection
- **Description:** Newline/control characters in email should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com\nBcc: attacker@evil.com"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Prevents email/header injection.

### TC-FP-043: Email Tab Character
- **Priority:** P2
- **Category:** Domain Partition - Email Format
- **Description:** Control whitespace in email should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@eshop.com\t"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Invalid email syntax.

### TC-FP-044: Internationalized Domain
- **Priority:** P2
- **Category:** Domain Partition - Email Format
- **Description:** Internationalized domain should follow policy
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:**
  ```json
  {
    "email": "test@??.??"
  }
  ```
- **Expected Response:** 400 Bad Request
- **Notes:** Chosen policy: reject Unicode domain.

### TC-FP-045: No Request Body
- **Priority:** P1
- **Category:** Schema Validation
- **Description:** Request with no body should be rejected
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `X-Student-Id: {{studentId}}`
- **Request Body:** No body
- **Expected Response:** 400 Bad Request
- **Notes:** No JSON body provided.

---

## Test Case Summary

| Category | Count |
|----------|-------|
| Happy Path | 1 |
| Domain Partition - Existing Email | 2 |
| Domain Partition - Email Format | 9 |
| Domain Partition - Email | 2 |
| Schema Validation | 12 |
| Security - Information Disclosure | 1 |
| Security - SQL Injection (SEC-01) | 2 |
| Security - XSS (SEC-02) | 2 |
| Security - Input Validation (SEC-04) | 1 |
| Domain Partition - Email Trimming | 1 |
| Domain Partition - Email Case | 1 |
| Domain Partition - Email Length | 2 |
| Security - Content Type Validation (SEC-04) | 1 |
| Authentication Boundary | 2 |
| HTTP Method Validation | 3 |
| Security - Rate Limiting (SEC-06) | 1 |
| Security - Race Condition (SEC-07) | 1 |
| Security - Header Injection | 1 |
| **Total** | **45** |

## Response Schema Validation

### Success Response (200 OK)
```json
{
  "message": "string",
  "resetToken": "string"
}
```

### Error Response (400/404/429)
```json
{
  "error": "string"
}
```

## Test Execution Notes

1. Reset database with `node eshop-sut/backend/database.js` before a clean run if token state matters.
2. Use `FR3_Local.postman_environment.json` with `baseUrl = http://localhost:3000` and `studentId = 23127325`.
3. The current backend returns `resetToken` directly in the response; this is useful for testing but should be reported as a security risk in a real system.
4. TC-FP-014 and TC-FP-040 intentionally target likely security weaknesses: account enumeration and missing rate limiting.
