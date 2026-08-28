# Test Cases — Cancel Order API (FR-10)

**Endpoint:** `PUT /api/orders/:id/cancel`  
**Base URL:** `http://localhost:3000`  
**Auth Required:** Yes (Bearer Token)

## API Specification

**Path Parameters:**
- `id` — Order ID (integer)

**Response:** (Success — 200 OK)
```json
{
  "message": "Order cancelled successfully",
  "order": {
    "id": 1,
    "status": "cancelled",
    "updatedAt": "2026-08-22T10:00:00Z"
  }
}
```

---

## Test Case List

### TC-CANCEL-001: Cancel Pending Order (Valid State Transition)
- **Priority:** P0 (Critical)
- **Category:** State Transition — Valid Cancellation
- **Description:** Order in "pending" status should be cancellable
- **Request:** `PUT /api/orders/1/cancel`
- **Prerequisite:** Order must be in "pending" status
- **Expected Response:** 200 OK with order status changed to "cancelled"
- **State Transition:** pending → cancelled

### TC-CANCEL-002: Cancel Confirmed Order
- **Priority:** P0 (Critical)
- **Category:** State Transition — Conditional Cancellation
- **Description:** Order in "confirmed" status may be cancellable depending on policy
- **Request:** `PUT /api/orders/2/cancel`
- **Prerequisite:** Order must be in "confirmed" status
- **Expected Response:** 200 OK (if allowed) or 400 (if not allowed)

### TC-CANCEL-003: Attempt to Cancel Shipping Order
- **Priority:** P0 (Critical)
- **Category:** State Transition — Invalid Cancellation
- **Description:** Order in "shipping" status should NOT be cancellable
- **Request:** `PUT /api/orders/3/cancel`
- **Prerequisite:** Order must be in "shipping" status
- **Expected Response:** 400 Bad Request with "cannot cancel" error
- **State Transition:** shipping → cancelled (BLOCKED)

### TC-CANCEL-004: Attempt to Cancel Delivered Order
- **Priority:** P0 (Critical)
- **Category:** State Transition — Invalid Cancellation
- **Description:** Order in "delivered" status should NOT be cancellable
- **Request:** `PUT /api/orders/4/cancel`
- **Prerequisite:** Order must be in "delivered" status
- **Expected Response:** 400 Bad Request with "cannot cancel" error
- **State Transition:** delivered → cancelled (BLOCKED)

### TC-CANCEL-005: Attempt to Cancel Already Cancelled Order
- **Priority:** P1 (High)
- **Category:** State Transition — Invalid Cancellation
- **Description:** Order already cancelled cannot be cancelled again
- **Request:** `PUT /api/orders/5/cancel`
- **Prerequisite:** Order must be in "cancelled" status
- **Expected Response:** 400 Bad Request with "already cancelled" error

### TC-CANCEL-006: Cancel Non-Existent Order
- **Priority:** P0 (Critical)
- **Category:** Business Logic — Non-Existent Resource
- **Description:** Cancelling non-existent order should return appropriate error
- **Request:** `PUT /api/orders/999999/cancel`
- **Expected Response:** 404 Not Found

### TC-CANCEL-007: Cancel Order with Invalid ID Format (String)
- **Priority:** P1 (High)
- **Category:** Domain Partition — ID Validation
- **Description:** Non-numeric order ID should be rejected
- **Request:** `PUT /api/orders/abc/cancel`
- **Expected Response:** 400 Bad Request with validation error

### TC-CANCEL-008: Cancel Order with Negative ID
- **Priority:** P1 (High)
- **Category:** Domain Partition — ID Validation
- **Description:** Negative order ID should be rejected
- **Request:** `PUT /api/orders/-1/cancel`
- **Expected Response:** 400 Bad Request with validation error

### TC-CANCEL-009: Cancel Order with Zero ID
- **Priority:** P1 (High)
- **Category:** Domain Partition — ID Validation
- **Description:** Zero order ID should be rejected
- **Request:** `PUT /api/orders/0/cancel`
- **Expected Response:** 400 Bad Request with validation error

### TC-CANCEL-010: Cancel Order with Float ID
- **Priority:** P1 (High)
- **Category:** Domain Partition — ID Validation
- **Description:** Floating-point order ID should be rejected
- **Request:** `PUT /api/orders/1.5/cancel`
- **Expected Response:** 400 Bad Request with validation error

### TC-CANCEL-011: Cancel Order with SQL Injection in ID
- **Priority:** P0 (Critical)
- **Category:** Security — SQL Injection (SEC-01)
- **Description:** SQL injection in order ID should be sanitized
- **Request:** `PUT /api/orders/1' OR '1'='1/cancel`
- **Expected Response:** 400 Bad Request (no SQL execution)

### TC-CANCEL-012: Cancel Order with UNION SQL Injection in ID
- **Priority:** P0 (Critical)
- **Category:** Security — SQL Injection (SEC-01)
- **Description:** UNION-based SQL injection should be blocked
- **Request:** `PUT /api/orders/1 UNION SELECT * FROM users--/cancel`
- **Expected Response:** 400 Bad Request (no data exposure)

### TC-CANCEL-013: Cancel Order Without Authentication
- **Priority:** P0 (Critical)
- **Category:** Security — Authentication (SEC-03)
- **Description:** Request without auth token should be rejected
- **Headers:** No `Authorization` header
- **Expected Response:** 401 Unauthorized

### TC-CANCEL-014: Cancel Order with Invalid Token Format
- **Priority:** P0 (Critical)
- **Category:** Security — Authentication (SEC-03)
- **Description:** Request with malformed token should be rejected
- **Headers:** `Authorization: InvalidToken`
- **Expected Response:** 401 Unauthorized

### TC-CANCEL-015: Cancel Order with Expired Token
- **Priority:** P0 (Critical)
- **Category:** Security — Authentication (SEC-03)
- **Description:** Request with expired token should be rejected
- **Headers:** `Authorization: Bearer <expired_token>`
- **Expected Response:** 401 Unauthorized

### TC-CANCEL-016: Cancel Another User's Order (IDOR)
- **Priority:** P0 (Critical)
- **Category:** Security — IDOR (SEC-03)
- **Description:** User should not be able to cancel another user's order
- **Request:** `PUT /api/orders/100/cancel` (order belongs to different user)
- **Expected Response:** 403 Forbidden
- **Security Check:** Verify authorization check exists

### TC-CANCEL-017: Cancel Order with Basic Auth Instead of Bearer
- **Priority:** P1 (High)
- **Category:** Security — Authentication (SEC-03)
- **Description:** Wrong auth type should be rejected
- **Headers:** `Authorization: Basic dXNlcjpwYXNz`
- **Expected Response:** 401 Unauthorized

### TC-CANCEL-018: Cancel Order Without Bearer Prefix
- **Priority:** P1 (High)
- **Category:** Security — Authentication (SEC-03)
- **Description:** Token without Bearer prefix should be rejected
- **Headers:** `Authorization: some_token_without_bearer`
- **Expected Response:** 401 Unauthorized

### TC-CANCEL-019: XSS Payload in Custom Header
- **Priority:** P1 (High)
- **Category:** Security — XSS (SEC-02)
- **Description:** XSS in custom header should be sanitized
- **Headers:** `X-Custom-Header: <script>alert('XSS')</script>`
- **Expected Response:** 200 OK or sanitized

### TC-CANCEL-020: Very Long Order ID
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — ID Validation
- **Description:** Extremely long order ID should be handled
- **Request:** `PUT /api/orders/999999999999999999999999999/cancel`
- **Expected Response:** 400 Bad Request or 404

### TC-CANCEL-021: Null Order ID
- **Priority:** P1 (High)
- **Category:** Domain Partition — ID Validation
- **Description:** Null order ID should be rejected
- **Request:** `PUT /api/orders/null/cancel`
- **Expected Response:** 400 Bad Request with validation error

### TC-CANCEL-022: Missing Order ID
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Missing order ID should return 404
- **Request:** `PUT /api/orders//cancel`
- **Expected Response:** 404 Not Found or 400

### TC-CANCEL-023: Extra Fields in Request Body
- **Priority:** P2 (Medium)
- **Category:** Schema Validation
- **Description:** Extra fields should be ignored or cause error
- **Request:** `PUT /api/orders/1/cancel` with body `{"extraField": "value"}`
- **Expected Response:** 200 OK (extra ignored) or 400 (strict mode)

### TC-CANCEL-024: Cancel Order with Token for Different Role
- **Priority:** P0 (Critical)
- **Category:** Security — Role Escalation (SEC-05)
- **Description:** User role token should not allow admin actions (if applicable)
- **Headers:** `Authorization: Bearer <user_token>` (not admin)
- **Request:** `PUT /api/orders/1/cancel` (admin-only operation)
- **Expected Response:** 403 Forbidden (if role-based access control exists)

### TC-CANCEL-025: Rate Limiting — Multiple Rapid Cancel Requests
- **Priority:** P1 (High)
- **Category:** Security — Rate Limiting (SEC-06)
- **Description:** Multiple rapid cancel attempts should be rate limited
- **Request:** Send 20+ cancel requests in quick succession
- **Expected Response:** 429 Too Many Requests after threshold

### TC-CANCEL-026: Race Condition — Concurrent Cancellation
- **Priority:** P1 (High)
- **Category:** Security — Race Condition (SEC-07)
- **Description:** Two simultaneous cancel requests should be handled atomically
- **Request:** Send 2 identical cancel requests simultaneously
- **Expected Response:** One succeeds, one gets "already cancelled" error

### TC-CANCEL-027: Cancel Order with Invalid JSON
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Invalid JSON in request body should be handled
- **Request:** `PUT /api/orders/1/cancel` with body `{invalid}`
- **Expected Response:** 200 OK or 400 (body may be ignored)

### TC-CANCEL-028: Cancel Order with Token Missing User Context
- **Priority:** P1 (High)
- **Category:** Security — Authorization
- **Description:** Token without user context should be rejected
- **Headers:** `Authorization: Bearer <token_without_user_id>`
- **Expected Response:** 401 Unauthorized

### TC-CANCEL-029: Cancel Order While Status Transition is in Progress
- **Priority:** P2 (Medium)
- **Category:** State Transition — Race Condition
- **Description:** Cancel during status update should be handled atomically
- **Prerequisite:** Order status being updated simultaneously
- **Expected Response:** Consistent state after concurrent operations

### TC-CANCEL-030: Cancel Order with Special Characters in ID
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — ID Validation
- **Description:** ID with special characters should be rejected
- **Request:** `PUT /api/orders/1@#$/cancel`
- **Expected Response:** 400 Bad Request

### TC-CANCEL-031: Verify Cancel Response Schema
- **Priority:** P1 (High)
- **Category:** Schema Validation — Response
- **Description:** Success response must match expected schema
- **Expected Response Schema:**
  ```json
  {
    "message": "string",
    "order": {
      "id": "number",
      "status": "string",
      "updatedAt": "string (ISO date)"
    }
  }
  ```

### TC-CANCEL-032: Verify Error Response Schema
- **Priority:** P1 (High)
- **Category:** Schema Validation — Response
- **Description:** Error response must match expected schema
- **Expected Response Schema:**
  ```json
  {
    "error": "string"
  }
  ```
  or
  ```json
  {
    "message": "string"
  }
  ```

### TC-CANCEL-033: Cancel Order After Refund Processed
- **Priority:** P2 (Medium)
- **Category:** Business Logic
- **Description:** Order with processed refund should have special handling
- **Prerequisite:** Order refund already processed
- **Expected Response:** 400 Bad Request or special error message

### TC-CANCEL-034: Cancel Order with Missing Content-Type Header
- **Priority:** P2 (Medium)
- **Category:** Schema Validation
- **Description:** Request without Content-Type should be handled
- **Headers:** No `Content-Type` header
- **Expected Response:** 200 OK (Content-Type optional for PUT)

### TC-CANCEL-035: Cancel Order with Wrong HTTP Method
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Using POST instead of PUT should be rejected
- **Request:** `POST /api/orders/1/cancel`
- **Expected Response:** 405 Method Not Allowed

### TC-CANCEL-036: Cancel Order with Wrong HTTP Method (GET)
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Using GET instead of PUT should be rejected
- **Request:** `GET /api/orders/1/cancel`
- **Expected Response:** 405 Method Not Allowed

### TC-CANCEL-037: Cancel Order with DELETE Method
- **Priority:** P1 (High)
- **Category:** Schema Validation
- **Description:** Using DELETE instead of PUT should be rejected
- **Request:** `DELETE /api/orders/1/cancel`
- **Expected Response:** 405 Method Not Allowed or 400

### TC-CANCEL-038: Verify Order Status Changed to "cancelled"
- **Priority:** P0 (Critical)
- **Category:** State Transition — Verification
- **Description:** After cancellation, order status must be "cancelled"
- **Test Flow:** 
  1. Create order
  2. Cancel order
  3. GET order details
  4. Verify status === "cancelled"
- **Expected Response:** Status field contains "cancelled"

### TC-CANCEL-039: Cancel Order with Unicode ID
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — ID Validation
- **Description:** Unicode characters in ID should be handled
- **Request:** `PUT /api/orders/测试/cancel`
- **Expected Response:** 400 Bad Request

### TC-CANCEL-040: Cancel Order After Cancellation Window Expires
- **Priority:** P2 (Medium)
- **Category:** Business Logic — Time-Based Rules
- **Description:** Cancellation window (e.g., 24 hours) should be enforced
- **Prerequisite:** Order created > 24 hours ago
- **Expected Response:** 400 Bad Request with "window expired" error

### TC-CANCEL-041: Cancel Order with Partial ID Match
- **Priority:** P2 (Medium)
- **Category:** Security — ID Validation
- **Description:** Trailing slash should not affect cancellation
- **Request:** `PUT /api/orders/1//cancel`
- **Expected Response:** 404 or 400 Bad Request

### TC-CANCEL-042: Concurrent Cancel and Update Requests
- **Priority:** P1 (High)
- **Category:** Security — Race Condition (SEC-07)
- **Description:** Simultaneous cancel and status update should be atomic
- **Request:** Send cancel and status update simultaneously
- **Expected Response:** Consistent final state

### TC-CANCEL-043: Cancel Order with Expired Session but Valid Token
- **Priority:** P1 (High)
- **Category:** Security — Session Validation
- **Description:** Expired session with valid token should be handled
- **Headers:** `Authorization: Bearer <valid_token>`
- **Expected Response:** 200 OK or 401 (depends on auth implementation)

### TC-CANCEL-044: Cancel Order with Malformed UUID (if applicable)
- **Priority:** P2 (Medium)
- **Category:** Domain Partition — ID Format
- **Description:** Invalid UUID format should be rejected
- **Request:** `PUT /api/orders/550e8400-e29b-41d4-a716-446655440000/cancel`
- **Expected Response:** 400 Bad Request (if ID is not UUID type)

### TC-CANCEL-045: Verify updatedAt Timestamp After Cancellation
- **Priority:** P1 (High)
- **Category:** Business Logic — Timestamp Verification
- **Description:** updatedAt should be updated on cancellation
- **Test Flow:**
  1. Record original updatedAt
  2. Cancel order
  3. Verify new updatedAt > original updatedAt
- **Expected Response:** updatedAt timestamp reflects cancellation time

---

## Test Case Summary

| Category | Count |
|----------|-------|
| State Transition — Valid Cancellation | 1 |
| State Transition — Conditional Cancellation | 1 |
| State Transition — Invalid Cancellation | 3 |
| State Transition — Verification | 1 |
| State Transition — Race Condition | 2 |
| Domain Partition — ID Validation | 8 |
| Security — SQL Injection | 2 |
| Security — XSS | 1 |
| Security — Authentication | 5 |
| Security — IDOR | 1 |
| Security — Role Escalation | 1 |
| Security — Rate Limiting | 1 |
| Security — Race Condition | 2 |
| Schema Validation | 8 |
| Schema Validation — Response | 2 |
| Business Logic | 4 |
| Business Logic — Time-Based Rules | 1 |
| **Total** | **45** |

---

## State Transition Matrix

| Current Status | Cancel Allowed? | New Status | Test Case |
|----------------|-----------------|------------|-----------|
| pending | Yes | cancelled | TC-CANCEL-001 |
| confirmed | Depends on policy | cancelled / error | TC-CANCEL-002 |
| shipping | No | (stays shipping) | TC-CANCEL-003 |
| delivered | No | (stays delivered) | TC-CANCEL-004 |
| cancelled | No | (stays cancelled) | TC-CANCEL-005 |

---

## Response Schema Validation

### Success Response (200 OK)
```json
{
  "message": "string",
  "order": {
    "id": "number",
    "status": "string",
    "updatedAt": "string (ISO 8601)"
  }
}
```

### Error Response (400/401/403/404/405/429)
```json
{
  "error": "string"  // or "message": "string"
}
```

---

## Test Execution Notes

1. **Pre-request Setup:**
   - User must be logged in and have valid JWT token
   - Test orders must be created in various states (pending, confirmed, shipping, delivered, cancelled)
   - Set `Authorization: Bearer {{token}}` header
   - Set `X-Student-Id` header in all requests

2. **Postman Variables:**
   ```
   {{baseUrl}} = http://localhost:3000
   {{studentId}} = <Your Student ID>
   {{authToken}} = <JWT token from login>
   {{orderId}} = <Test order ID>
   ```

3. **Test Execution Order:**
   - Run TC-CANCEL-013/014/015 first to verify auth requirements
   - Run TC-CANCEL-006 to verify 404 handling
   - Run TC-CANCEL-001 first for valid cancellation
   - Run TC-CANCEL-003/004 for invalid state transitions
   - Run security tests (TC-CANCEL-011, TC-CANCEL-016)
   - Use Collection Runner for batch execution

4. **State Management:**
   - Create fresh orders for each state transition test
   - Some tests may modify order state affecting subsequent tests
   - Consider using data-driven approach with different order states

5. **State Transition Tests Dependency:**
   - TC-CANCEL-003 requires order in "shipping" state
   - TC-CANCEL-004 requires order in "delivered" state
   - TC-CANCEL-005 requires order already cancelled
   - TC-CANCEL-040 requires order > 24 hours old
