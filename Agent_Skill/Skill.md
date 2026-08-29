# SKILL.md — AI-Driven API Test Generator

## 1. Skill Name

AI-Driven API Test Generator

---

## 2. Purpose

This skill generates comprehensive API test cases for **user-selected
endpoints** from an API specification.

The skill does NOT automatically generate tests for every endpoint in the
API specification.

The user provides:

1. An API specification.
2. One or more target endpoints.

The agent then:

1. Reads the API specification.
2. Finds the requested endpoints.
3. Understands the API specification for those endpoints.
4. Extracts the API contract.
5. Designs at least 35 test cases per selected endpoint.
6. Validates test coverage.
7. Generates `testcases.md`.
8. Generates `tests.json`.
9. Generates `postman_collection.json`.

---

## 3. Input

The skill accepts:

```text
API Specification
+
Target Endpoint(s)
```

Example:

```
API Specification:
openapi.yaml

Target endpoints:
POST /api/forgot-password
PUT /api/orders/{id}/cancel
```

Another example:

```
API Specification:
openapi.yaml

Target endpoint:
PUT /api/orders/{id}/cancel
```

The agent must only generate tests for the endpoint(s) explicitly provided
by the user.

---

## 4. Endpoint Selection

The user may provide:

Method + Path

Example:

```
POST /api/forgot-password
```

or:

```
PUT /api/orders/{id}/cancel
```

The endpoint must be matched against the API specification.

Matching should consider:

```
HTTP method
+
endpoint path
```

Example:

User input:

```
PUT /api/orders/{id}/cancel
```

Specification:

```
/api/orders/{id}/cancel:
  put:
    ...
```

The agent selects only this operation.

## 5. Endpoint Validation

Before generating tests, verify that every requested endpoint exists in the
API specification.

For each requested endpoint:

```
IF endpoint exists:

    Continue

ELSE:

    Report:
    "Endpoint not found in API specification"

    Do not generate tests for that endpoint.
```

Example:

Requested:

```
PUT /api/orders/{id}/cancel
```

Result:

```
✓ Endpoint found
✓ HTTP method found
✓ API contract extracted
```

## 6. Read API Specification

Read the API specification as the source of truth.

Only inspect the parts necessary to understand the selected endpoint, including:

```
HTTP method
Path
Operation ID
Description
Path parameters
Query parameters
Headers
Request body
Content type
Request schema
Required fields
Optional fields
Data types
Formats
Minimum values
Maximum values
Minimum lengths
Maximum lengths
Patterns
Enumerations
Authentication
Authorization
Business rules
Response status codes
Response schemas
Error schemas
Response headers
Examples
```

Do not generate tests for unrelated endpoints.

## 7. Understand API Contract

For each selected endpoint, create an internal API contract.

The contract should contain:

```
Endpoint
HTTP Method
Path Parameters
Query Parameters
Headers
Request Body
Authentication
Authorization
Input Constraints
Business Rules
Success Responses
Error Responses
Response Schemas
```

Example:

```json
{
  "method": "PUT",
  "path": "/api/orders/{id}/cancel",
  "parameters": {
    "id": {
      "location": "path",
      "required": true,
      "type": "integer",
      "minimum": 1
    }
  },
  "authentication": true,
  "responses": {
    "200": {},
    "400": {},
    "401": {},
    "403": {},
    "404": {}
  }
}
```

## 8. Test Case Target

Generate:

```
>= 35 test cases per selected endpoint
```

If multiple endpoints are provided:

```
Endpoint 1 → >= 35 tests
Endpoint 2 → >= 35 tests
Endpoint 3 → >= 35 tests
```

Do not combine the test count across endpoints.

For example:

```
POST /api/login
35 tests

PUT /api/orders/{id}/cancel
35 tests

Total:
70 tests
```

## 9. Domain Partition Testing

Domain partition testing is mandatory for every applicable parameter.

For every parameter, identify valid and invalid partitions.

Consider:

```
Valid values
Invalid values
Boundary values
Below minimum
Above maximum
Empty values
Null values
Missing values
Wrong data types
Invalid formats
Special characters
```

Only use constraints defined by the API specification.

## 10. Parameter Examples

### Email

For an email parameter, consider:

```
Valid email
Invalid email format
Missing @
Missing local part
Missing domain
Multiple @
Empty email
Null email
Missing email
Very long email
Wrong data type
```

Example:

```
test@example.com
invalid-email
@example.com
test@
test@@example.com
""
null
```

### Password

If password constraints exist, cover:

```
Valid password
Minimum valid length
Maximum valid length
Below minimum
Above maximum
Missing uppercase
Missing lowercase
Missing number
Missing special character
Empty password
Null password
Missing password
Wrong data type
```

Do not invent password rules not defined by the specification.

### Numeric Parameters

For parameters such as:

```
price > 0
```

cover:

```
Positive value
Minimum valid value
Zero
Negative value
Maximum valid value
Above maximum
Decimal
Null
Missing
String
Boolean
```

### ID Parameters

For IDs, consider:

```
Valid existing ID
Non-existing ID
Minimum ID
Zero
Negative ID
Decimal ID
Very large ID
String
Null
Missing
Special characters
```

## 11. Required and Optional Fields

For every required field:

```
Valid value
Missing field
Null
Empty value where applicable
Invalid type
Invalid format
Boundary value
Out-of-range value
```

For optional fields:

```
Field omitted
Valid value
Invalid value
Null if allowed
Boundary values
```

## 12. Request Body Testing

For request bodies, generate tests for:

```
Valid request
Missing required field
Multiple missing fields
Optional field omitted
Null field
Empty field
Wrong data type
Invalid format
Boundary values
Invalid enum
Malformed JSON
Empty object
Empty body
Unexpected additional field
```

## 13. State Transition Testing

State transition testing is mandatory for selected endpoints that operate on
stateful resources.

For FR-10 order APIs, consider:

```
pending
confirmed
shipping
delivered
```

Normal lifecycle:

```
pending
   |
   v
confirmed
   |
   v
shipping
   |
   v
delivered
```

Generate tests for valid and invalid transitions according to the API
specification.

## 14. FR-10 Cancellation Rules

For an order cancellation endpoint, generate tests for applicable states:

```
Cancel pending order
Cancel confirmed order
Cancel shipping order
Cancel delivered order
Cancel already cancelled order
Repeated cancellation
Invalid cancellation transition
```

Each state test should specify:

```
Initial State
Action
Expected Status Code
Expected Response
Expected Final State
```

Do not invent cancellation rules.

If the API specification does not define the rule, mark:

```
Not specified by API contract
```

## 15. Security Testing

Security testing must cover the following categories where applicable:

```
SEC-01 — SQL Injection
SEC-02 — XSS
SEC-03 — IDOR
SEC-04 — Authentication Bypass
SEC-05 — Role Escalation
SEC-06 — Parameter Manipulation
SEC-07 — Malformed / Abusive Input
```

## 16. SEC-01 — SQL Injection

Test applicable input locations:

```
Path parameters
Query parameters
Request body
Search parameters
IDs
```

Example:

```
' OR '1'='1
1 UNION SELECT *
```

## 17. SEC-02 — XSS

Test user-controlled input.

Example:

```
<script>alert(1)</script>
```

Verify that the API handles the input according to the contract and does not
incorrectly expose unsafe content.

## 18. SEC-03 — IDOR

For resources belonging to users, test:

```
User A token
+
User B resource ID
```

Verify that unauthorized access or modification is rejected.

## 19. SEC-04 — Authentication Bypass

Test:

```
No token
Empty token
Invalid token
Malformed token
Expired token
Wrong authentication scheme
```

## 20. SEC-05 — Role Escalation

Test unauthorized roles against protected operations.

Examples:

```
Normal user → admin operation
Wrong role
Missing role
Manipulated role
```

## 21. SEC-06 — Parameter Manipulation

Test security-sensitive parameters such as:

```
ID
User ID
Role
Status
Price
Ownership
Permission
```

## 22. SEC-07 — Malformed / Abusive Input

Test:

```
Very long input
Malformed JSON
Unexpected Content-Type
Special characters
Unicode
Unexpected fields
Invalid encoding
```

## 23. Response Schema Validation

Every documented response schema must be tested.

Validate:

```
HTTP status code
Content-Type
Response shape
Required properties
Property names
Property types
Nested objects
Arrays
Enums
Nullable fields
Additional properties
```

The response must match the API specification exactly when the specification
defines an exact schema.

## 24. Error Schema Validation

For every documented error response, validate:

```
Status code
Content-Type
Response body
Required error fields
Field types
Error schema
```

## 25. Test Case Structure

Every test case must contain:

```
Test Case ID
Test Case
API
Method
Category
Objective
Test Data
Preconditions
Expected Result
Expected Status Code
Schema Validation
Security ID
Initial State
Expected Final State
```

Fields that are not applicable should contain:

```
N/A
```

## 26. Test Case IDs

Use:

```
TC-{API_IDENTIFIER}-{NUMBER}
```

Example:

```
TC-CANCEL-001
TC-CANCEL-002
TC-CANCEL-003
...
TC-CANCEL-035
```

IDs must be unique.

## 27. Test Coverage Validation

After generation, calculate coverage for the selected endpoint.

Check:

```
Parameter coverage
Domain partition coverage
Boundary coverage
Required field coverage
Optional field coverage
Data type coverage
State transition coverage
Cancellation coverage
Security coverage
Success schema coverage
Error schema coverage
```

## 28. Coverage Repair

If fewer than 35 test cases exist:

```
WHILE testCaseCount < 35:

    missingCoverage ← IdentifyMissingCoverage()

    additionalTests ← GenerateTests(
        APIContract,
        missingCoverage
    )

    Add(additionalTests)

    RemoveDuplicates()

END WHILE
```

The agent should prioritize missing coverage rather than creating meaningless
duplicates.

## 29. Duplicate Removal

Remove tests with the same testing purpose.

Compare:

```
Purpose
Input partition
Expected behavior
State
Security category
```

Different values should not automatically be treated as different tests if
they belong to the same equivalence partition.

## 30. Final Test Validation

Before output, validate every test:

```
Unique ID
Correct endpoint
Correct HTTP method
Valid test data
Explicit expected result
Expected status code
Correct category
Contract traceability
No unsupported assumptions
No duplicate purpose
```

## 31. Output: testcases.md

Generate:

```
testcases.md
```

Structure:

```
# API Test Cases

## 1. Selected Endpoint

## 2. API Contract

## 3. Test Design Strategy

## 4. Coverage Summary

## 5. Test Cases

| Test Case ID | Test Case | API | Method | Category | Objective | Test Data | Preconditions | Expected Result | Expected Status | Schema Validation | Security ID | Initial State | Expected Final State |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## 6. Coverage Matrix

## 7. Assumptions and Limitations
```

Only selected endpoints must appear in this file.

## 32. Output: tests.json

Generate:

```
tests.json
```

Example:

```json
{
  "api": {
    "method": "PUT",
    "path": "/api/orders/{id}/cancel"
  },
  "totalTestCases": 35,
  "testCases": [
    {
      "id": "TC-CANCEL-001",
      "name": "Cancel valid pending order",
      "method": "PUT",
      "path": "/api/orders/{id}/cancel",
      "category": "Positive",
      "objective": "Verify cancellation of a valid order",
      "testData": {
        "id": 1
      },
      "preconditions": [
        "Valid authenticated user",
        "Order is cancellable"
      ],
      "expectedStatus": 200,
      "expectedResult": "Order is cancelled",
      "schemaValidation": true,
      "securityId": null,
      "initialState": "pending",
      "expectedFinalState": "cancelled"
    }
  ]
}
```

The actual file must contain all generated test cases.

## 33. Output: Postman Collection

Generate:

```
postman_collection.json
```

Use Postman Collection Schema v2.1.

Example:

```json
{
  "info": {
    "name": "AI Generated API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": []
}
```

Create one Postman request for every test case.

Each request should contain:

```
Request name
HTTP method
URL
Path variables
Query parameters
Headers
Authentication
Request body
Postman test scripts
```

## 34. Postman Assertions

For status validation:

```javascript
pm.test("Status code is expected", function () {
    pm.expect(pm.response.code).to.eql(200);
});
```

For response schema validation, validate the required properties and types.

Example:

```javascript
const response = pm.response.json();

pm.test("Response contains id", function () {
    pm.expect(response).to.have.property("id");
});

pm.test("id is a number", function () {
    pm.expect(response.id).to.be.a("number");
});
```

When a JSON schema exists, prefer JSON Schema validation.

## 35. Environment Variables

Use reusable Postman variables:

```
{{baseUrl}}
{{token}}
{{userToken}}
{{adminToken}}
{{orderId}}
```

Never hard-code secrets.

## 37. Example Usage

The user provides:

```
Specification:
openapi.yaml

Endpoints:
POST /api/forgot-password
PUT /api/orders/{id}/cancel
```

The agent must generate:

```
testcases.md

    Forgot Password
        >= 35 tests

    Cancel Order
        >= 35 tests


tests.json

    Forgot Password tests
    Cancel Order tests


postman_collection.json

    Forgot Password requests
    Cancel Order requests
```

The agent must NOT generate tests for:

```
/api/login
/api/register
/api/products
/api/cart
/api/checkout
```

unless the user explicitly selects those endpoints.

## 38. Final Validation Checklist

Before completing the task:

```
[ ] API specification parsed
[ ] Requested endpoints identified
[ ] Only requested endpoints processed
[ ] API contract extracted
[ ] Every applicable parameter analyzed
[ ] Domain partitions covered
[ ] Boundary values covered
[ ] Required fields covered
[ ] Optional fields covered
[ ] Data types covered
[ ] State transitions covered where applicable
[ ] FR-10 states covered where applicable
[ ] Cancellation rules covered where applicable
[ ] SEC-01 covered where applicable
[ ] SEC-02 covered where applicable
[ ] SEC-03 covered where applicable
[ ] SEC-04 covered where applicable
[ ] SEC-05 covered where applicable
[ ] SEC-06 covered where applicable
[ ] SEC-07 covered where applicable
[ ] Success response schema covered
[ ] Error response schema covered
[ ] >= 35 tests per selected endpoint
[ ] Duplicate tests removed
[ ] Unique test IDs
[ ] testcases.md generated
[ ] tests.json generated
[ ] postman_collection.json generated
[ ] Postman Collection v2.1
[ ] No hard-coded secrets
```