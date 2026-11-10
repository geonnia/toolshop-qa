# Test levels and types: Toolshop

**System under test:** Practice Software Testing ("Toolshop"), sprint 5: Angular frontend, Laravel REST API and a database, runnable locally in Docker.
**Based on:** ISTQB CTFL v4.0.1, section 2.2, and the Toolshop repository and API source code (checked 2026-11-02).

## 1. Test levels

| Level | Focus | Examples in Toolshop | Who | Environment and tools |
|---|---|---|---|---|
| Component | One unit in isolation | Gift card number rule: exactly 16 letters or digits (test 15, 16, 17 characters). Credit card expiry date must be after today. Postcode format check per country | Developers; QA reviews which risky rules are covered | Developer machine and CI; Pest (API unit tests in sprint 5) |
| Component integration | Interfaces and interactions between components | API and database: create a cart, add a product, change the quantity, read the cart back. Order creation: invoice saved and checkout email dispatched. Frontend and API agree on the request and response format | Developers; QA for API-level integration tests | Local Docker stack (API and database), CI; Pact for contract tests; Playwright `request` for API tests |
| System | Behaviour of the whole shop | Guest checkout end to end with each payment method. Search, filters, sorting and pagination working together. Admin changes an order status and the customer sees it | QA | Test environment: local Docker stack or the public demo; Playwright in Chromium, Firefox and WebKit |
| System integration | Interfaces with external systems and services | Checkout confirmation email (caught by MailCatcher locally). Login via Google and GitHub. Address lookup when it is configured to use the external HTTP service | QA together with developers | Integration environment with MailCatcher, OAuth test apps, the address service or its fake |
| Acceptance | Readiness for release, validation against business needs | Product owner checks a story against its acceptance criteria, e.g. "a guest can pay by gift card". Operational acceptance: the stack deploys, migrations and seeding run | Product owner and business users; operations for operational acceptance | Production-like staging environment |

**Notes**

- **Payment is simulated inside the API** (`POST /payment/check`), so in Toolshop it is tested at system level. In a real shop the payment provider is an external system, and the same checks would belong to system integration testing.
- **Address lookup uses a local fake driver by default** and calls an external HTTP service only when configured to. The fake works as service virtualization: system tests can run without the real service, but the real integration still needs its own tests.

## 2. Test types

| Type | Question it answers | Example in Toolshop |
|---|---|---|
| Functional | Does it do what it should? | Line total = price × quantity; the cart total updates after a quantity change |
| Non-functional | How well does it do it? | See section 3 |
| Black-box | What should happen, according to the requirements, without looking at the code? | Boundary values for the gift card number taken from the rule: 15, 16, 17 characters |
| White-box | Are all code paths tested? | The payment check has a branch per payment method. An unknown `payment_method` is not validated and returns "Payment was successful", which is found only by reading the code |
| Confirmation | Is the reported defect fixed? | After a fix for "bank name with diacritics is rejected", rerun exactly that case |
| Regression | Did the change break anything else? | After the bank name rule changes, rerun all payment method tests and the checkout smoke suite |

All four test types can be applied at every test level (CTFL 2.2.2). For example, security is checked at component integration level through direct API calls and at system level through the UI.

## 3. Non-functional characteristics (ISO/IEC 25010)

| Characteristic | Example checks in Toolshop | Level | Tools |
|---|---|---|---|
| Performance efficiency | Response time of product search and the product list with many concurrent users. Agree the target with the team before testing | Component (single endpoint), then system | k6 |
| Compatibility | Critical user journeys pass in Chromium, Firefox and WebKit; layout works at a mobile viewport | System | Playwright projects and device emulation |
| Usability and accessibility | The "required" marker lives only in the placeholder and disappears while typing (billing address form). The compare page is reachable only via "Compare now". The price slider works with the keyboard. No critical axe violations on the checkout pages | Component (single UI element), then system | Exploratory sessions; `@axe-core/playwright` |
| Reliability | The address lookup fails (API returns 502): the user can still type the address and continue. A double click on the order confirmation creates exactly one order | System, system integration | Playwright `page.route` to simulate failures |
| Security | Same error message for a wrong password and an unknown email. A customer cannot change an order status via the API (no admin check is visible in the controller). A customer cannot open another customer's invoice by changing its ID | Component integration (API), system | Playwright `request`, manual checks |
| Maintainability, portability, safety | Out of scope for QA here: maintainability is owned by developers through code review and static analysis; the shop has one deployment target (Docker); safety does not apply, as the software cannot cause physical harm | — | — |

## 4. Open questions

- Which address lookup driver does the public demo use: the fake or the external service?
- Is the admin role for order status changes checked somewhere outside the controller?
- Does the Angular frontend have its own unit tests? (not checked)
- Who plays the product owner for acceptance testing in this training project?

## Sources

- [ISTQB CTFL Syllabus v4.0.1](https://www.istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf), section 2.2
- [Toolshop repository](https://github.com/testsmith-io/practice-software-testing) (README: Laravel API, Angular frontend, Pest, Pact, MailCatcher)
- API source code, sprint 5: [routes](https://raw.githubusercontent.com/testsmith-io/practice-software-testing/main/sprint5/API/routes/api.php), [PaymentController](https://raw.githubusercontent.com/testsmith-io/practice-software-testing/main/sprint5/API/app/Http/Controllers/PaymentController.php), [GiftCard](https://raw.githubusercontent.com/testsmith-io/practice-software-testing/main/sprint5/API/app/Payments/GiftCard.php), [InvoiceController](https://raw.githubusercontent.com/testsmith-io/practice-software-testing/main/sprint5/API/app/Http/Controllers/InvoiceController.php), [PostcodeController](https://raw.githubusercontent.com/testsmith-io/practice-software-testing/main/sprint5/API/app/Http/Controllers/PostcodeController.php)
