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

Look at Context.md for Output Examples( for jsons ), Api_Specification.
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

## 33. Output: Postman Collection

{
    "info": {
        "name": "FR7 Add To Cart API Test Collection",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "TC-CART-001: Valid Cart Add Request",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 1,\n  \"name\": \"iPhone 15 Pro\",\n  \"price\": 999.99,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-002: Price Zero",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 2,\n  \"name\": \"Free Sample\",\n  \"price\": 0,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-003: Negative Price",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 3,\n  \"name\": \"Discount Item\",\n  \"price\": -10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-004: Very Large Price (Exceeds Maximum)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 4,\n  \"name\": \"Expensive Item\",\n  \"price\": 999999999.99,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-005: Price with Too Many Decimal Places",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 5,\n  \"name\": \"Precise Item\",\n  \"price\": 10.999,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-006: Negative Quantity",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 6,\n  \"name\": \"Test Product\",\n  \"price\": 50,\n  \"quantity\": -5\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-007: Zero Quantity",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 7,\n  \"name\": \"Test Product\",\n  \"price\": 50,\n  \"quantity\": 0\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-008: Very Large Quantity",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 8,\n  \"name\": \"Bulk Product\",\n  \"price\": 10,\n  \"quantity\": 999999\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-009: Quantity as Decimal/Float",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 9,\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1.5\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-010: Empty Product ID",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": \"\",\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-011: Null Product ID",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": null,\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-012: Non-Numeric ID",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": \"abc123\",\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-013: Empty Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 10,\n  \"name\": \"\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-014: Null Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 11,\n  \"name\": null,\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-015: Very Long Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 12,\n  \"name\": \"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-016: XSS Payload in Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 13,\n  \"name\": \"\u003cscript\u003ealert(\u0027XSS\u0027)\u003c/script\u003e\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-017: SQL Injection in Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 14,\n  \"name\": \"Product\u0027; DROP TABLE cart;--\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-018: SQL Injection in ID Field",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": \"1 OR 1=1\",\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-019: Missing ID Field",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-020: Missing Name Field",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 15,\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-021: Missing Price Field",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 16,\n  \"name\": \"Test Product\",\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-022: Missing Quantity Field",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 17,\n  \"name\": \"Test Product\",\n  \"price\": 25\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-023: Extra Unknown Field in Request",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 18,\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1,\n  \"extraField\": \"shouldBeIgnored\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-024: No Authentication Token",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 1,\n  \"name\": \"Product\",\n  \"price\": 10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(401); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-025: Invalid Authentication Token Format",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "InvalidToken",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 1,\n  \"name\": \"Product\",\n  \"price\": 10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(401); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-026: Expired Authentication Token",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzg3OTE2MTAxLCJpYXQiOjE3ODc5MTk3MDF9.KDSAjPQz9ed2Btxl4pazwsHNPpw1KN7FWxkWKmBiDco",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 1,\n  \"name\": \"Product\",\n  \"price\": 10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(401); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-027: SQL Injection via Price Parameter",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 19,\n  \"name\": \"Test Product\",\n  \"price\": \"50; DROP TABLE users;--\",\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-028: SQL Injection via Quantity Parameter",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 20,\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": \"1; DELETE FROM cart;--\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-029: Price as String Instead of Number",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 21,\n  \"name\": \"Test Product\",\n  \"price\": \"fifty\",\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-030: Quantity as String Instead of Number",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 22,\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": \"one\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-031: Invalid JSON Format",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{id: 23, name: \"Test\", price: 25, quantity: 1}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-032: Empty Request Body",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-033: Non-Existent Product ID",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 999999,\n  \"name\": \"Non-existent Product\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(404); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-034: Adding Same Product Twice",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 24,\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 2\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-035: Price Mismatch with Server",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 25,\n  \"name\": \"Product A\",\n  \"price\": 10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-036: Unicode Characters in Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 26,\n  \"name\": \"Sáº£n Pháº©m Tiáº¿ng Viá»‡t\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-037: Duplicate Cart Item (Same ID, Different Name)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 27,\n  \"name\": \"Different Name\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-038: Missing Authorization Header (Bearer Prefix)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzg3OTE2MTAxLCJpYXQiOjE3ODc5MTk3MDF9.KDSAjPQz9ed2Btxl4pazwsHNPpw1KN7FWxkWKmBiDco",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 1,\n  \"name\": \"Product\",\n  \"price\": 10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(401); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-039: Special Characters in Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 28,\n  \"name\": \"Product @#$%^\u0026*()\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-040: Floating Point Precision in Price",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 29,\n  \"name\": \"Precise Product\",\n  \"price\": 0.30000000000000004,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-041: Very Small Positive Price",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 30,\n  \"name\": \"Cheap Product\",\n  \"price\": 0.01,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-042: Negative Price via Type Coercion",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 31,\n  \"name\": \"Test Product\",\n  \"price\": \"-10.00\",\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-043: No Bearer Token (Basic Auth Instead)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Basic dXNlcjpwYXNz",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 1,\n  \"name\": \"Product\",\n  \"price\": 10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(401); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        }
    ]
}

{
  "id": "fr7-add-to-cart-env",
  "name": "FR-7 Add To Cart - Local",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "type": "default",
      "enabled": true
    },
    {
      "key": "studentId",
      "value": "23127325",
      "type": "default",
      "enabled": true
    },
    {
      "key": "authToken",
      "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3OTE5NzAxfQ.K_VEn6_RwQ0CzbWVQDETKME84BAOqFYIU3Sds_djHB4",
      "type": "default",
      "enabled": true
    }
  ]
}
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


# Newman Run commands

For 
postman/forgot-password-tests.json
:

```
newman run postman/forgot-password-tests.json --env-file postman/environment.json --reporters cli,html --reporter-html-export report/forgot-password-report.html
```

For 
postman/order-cancel-tests.json
:

```
newman run postman/order-cancel-tests.json --env-file postman/environment.json --reporters cli,html --reporter-html-export report/order-cancel-report.html
```