Bug: Forgot Password Is Case-Sensitive for Email Addresses
 #1
Open
Description
@lebao05
lebao05
opened 1h ago
Owner
Bug: Forgot Password Is Case-Sensitive for Email Addresses

Description:
The Forgot Password API treats uppercase and lowercase versions of the same email address as different accounts. As a result, when a user registers with test@gmail.com and later requests a password reset using TEST@gmail.com, the system does not recognize the email as belonging to the same account. Consequently, no reset token is generated and the password-reset flow cannot proceed.

Steps to Reproduce:

Register a new account using test@gmail.com.
Send a Forgot Password request using TEST@gmail.com.
Observe the API response.
Check whether a reset token is generated.

Expected Result:
The system should treat test@gmail.com and TEST@gmail.com as the same email address and generate a reset token for the registered account.

Actual Result:
The system treats TEST@gmail.com as a different email address, so the Forgot Password request does not generate a reset token.

Impact:
Users may be unable to reset their password when they enter their registered email address using different capitalization.

### Bug: Non-Existing Product Can Be Added to Cart
 #2
Open
Description
@lebao05
lebao05
opened 1h ago
Owner
Bug: Non-Existing Product Can Be Added to Cart
Description:
The system allows a user to add a product that does not exist in the product catalog to the cart. The API does not properly validate whether the specified product ID exists before adding the item.

Steps to Reproduce:

Select a product ID that does not exist in the database, e.g. 999999.
Send a request to add the product to the cart.
Check the cart contents.
Expected Result:
The system should reject the request and return an appropriate error, such as 404 Not Found, indicating that the product does not exist. The non-existing product should not be added to the cart.

Actual Result:
The system successfully adds the non-existing product to the cart.

Impact:
This can result in invalid cart data and may cause inconsistencies during cart calculation, checkout, or order creation.### Bug: Product Can Be Added to Cart with Mismatching Price
 #3
Open
Description
@lebao05
lebao05
opened 1h ago
Owner
Bug: Product Can Be Added to Cart with Mismatching Price
Description:
The system allows a product to be added to the cart using a price that does not match the product's actual price in the product catalog.

Steps to Reproduce:

Select an existing product with a known price, e.g. 100,000.
Send an Add to Cart request with the correct product ID but a different price, e.g. 1,000.
Check the cart contents.
Expected Result:
The system should ignore the client-provided price and use the product's actual price from the database, or reject the request if the submitted price does not match.

Actual Result:
The system accepts the mismatching price and adds the product to the cart using the client-provided price.

Impact:
This is a price manipulation vulnerability that may allow users to purchase products at an unauthorized price.Bug: Product Can Be Added to Cart with Negative Quantity
 #4
Open
Description
@lebao05
lebao05
opened 1h ago
Owner
Bug: Product Can Be Added to Cart with Negative Quantity

Description:
The system allows a product to be added to the cart with a negative quantity. The API does not properly validate that the requested quantity is a positive value.

Steps to Reproduce:

Select an existing product.
Send an Add to Cart request with a negative quantity, e.g. quantity: -1.
Check the cart contents.

Expected Result:
The system should reject the request and return a validation error, such as 400 Bad Request. The cart quantity should only accept valid positive values.

Actual Result:
The system accepts the negative quantity and adds or updates the product in the cart with a negative quantity.

Impact:
This can cause invalid cart data and may lead to incorrect price calculations, stock inconsistencies, or manipulation of the checkout total.Bug: Product Can Be Added to Cart with Empty Product ID
 #5
Open
Description
@lebao05
lebao05
opened 1h ago
Owner
Bug: Product Can Be Added to Cart with Empty Product ID

Description:
The system allows an Add to Cart request to be submitted with an empty product ID. The API does not properly validate that the product ID is provided and corresponds to a valid product.

Steps to Reproduce:

Send an Add to Cart request with an empty productId, e.g. productId: "".
Submit the request.
Check the API response and cart contents.

Expected Result:
The system should reject the request and return a validation error, such as 400 Bad Request. No item should be added to the cart.

Actual Result:
The system accepts the request with an empty product ID and adds the item to the cart.

Impact:
This can result in invalid cart data and may cause errors or inconsistencies during cart retrieval, price calculation, or checkout.

### Bug: Empty Product Name Is Accepted When Adding to Cart
 #6
Open
Description
@lebao05
lebao05
opened 1h ago
Owner
Bug: Empty Product Name Is Accepted When Adding to Cart
Description:
The system allows an Add to Cart request to be submitted with an empty product name. The API does not properly validate that the product name is provided and is not empty.

Steps to Reproduce:

Send an Add to Cart request with an empty productName, e.g. productName: "".
Submit the request.
Check the API response and cart contents.
Expected Result:
The system should reject the request and return a validation error, such as 400 Bad Request. No item should be added to the cart.

Actual Result:
The system accepts the request with an empty product name and adds the item to the cart.

Impact:
This can result in invalid cart data and may cause errors or inconsistencies when displaying cart items, processing orders, or generating order information.### Bug: Add to Cart Request Accepts Missing Quantity Field
 #7
Open
Description
@lebao05
lebao05
opened 1h ago
Owner
Bug: Add to Cart Request Accepts Missing Quantity Field
Description:
The system allows an Add to Cart request to be submitted without the required quantity field. The API does not properly validate that the quantity is provided.

Steps to Reproduce:

Send an Add to Cart request without the quantity field.
Submit the request.
Check the API response and cart contents.
Expected Result:
The system should reject the request and return a validation error, such as 400 Bad Request. No item should be added to the cart.

Actual Result:
The system accepts the request even though the quantity field is missing and processes the Add to Cart request.

Impact:
This can result in invalid cart data and may cause unexpected behavior in quantity calculations, cart totals, or checkout processing.### Bug: Add to Cart Request Accepts Empty Request Body
 #8
Open
Description
@lebao05
lebao05
opened 1h ago
Owner
Bug: Add to Cart Request Accepts Empty Request Body
Description:
The system accepts an Add to Cart request with an empty request body. The API does not properly validate that the required product and quantity information is provided.

Steps to Reproduce:

Send an Add to Cart request with an empty request body, e.g. {}.
Submit the request.
Check the API response and cart contents.
Expected Result:
The system should reject the request and return a validation error, such as 400 Bad Request. No item should be added to the cart.

Actual Result:
The system accepts the empty request body instead of returning a validation error.

Impact:
This can result in invalid cart operations and may cause unexpected behavior during cart retrieval, price calculation, or checkout processing.**Bug: Order Can Be Cancelled While in Shipping Status**
 #9
Open
Description
@lebao05
lebao05
opened 1h ago
Owner
Bug: Order Can Be Cancelled While in Shipping Status

Description:
The system allows an order with shipping status to be cancelled. According to the expected order state transition rules, an order that has already entered the shipping stage should not be cancellable.

Steps to Reproduce:

Create or select an order with shipping status.
Send a PUT /api/orders/:id/cancel request for that order.
Check the API response and the order status.
Expected Result:
The system should reject the cancellation request and return an appropriate error, such as 400 Bad Request. The order status should remain shipping.

Actual Result:
The system accepts the cancellation request and changes the order status from shipping to cancelled.

Impact:
This violates the defined order state transition rules and can cause inconsistencies in order fulfillment, inventory, and delivery processing.