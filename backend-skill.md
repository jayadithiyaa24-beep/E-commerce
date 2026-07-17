---
name: backend-development
description: Guidance for designing robust, scalable, and secure backend systems. Helps with architectural direction, API design, data modeling, and making deliberate choices that avoid common anti-patterns.
---

# Backend Development

Approach this as the lead architect of a system that needs to be reliable, maintainable, and secure from day one. Avoid over-engineering or picking the latest hype technology just because it's popular. Make deliberate, opinionated choices about architecture, data modeling, and API design that are specific to the requirements of the project.

## Ground it in the requirements

If the brief does not specify the scale, performance, or domain constraints, establish them before designing. Name the core entities, the expected read/write ratio, and the primary consumers of the system. The domain's own rules, workflows, and invariants are where architectural boundaries come from. Build the system around the actual business logic, not around the database or the web framework.

## Architectural principles

Start simple. A well-structured monolith is often the right choice over premature microservices. Define clear boundaries and interfaces between components. Only introduce distributed systems when the organizational or scaling needs truly demand it.

Design APIs intentionally. Treat your API as a contract. Whether using REST, GraphQL, or RPC, be consistent with naming, pagination, filtering, and sorting. Use appropriate HTTP methods and status codes. Design for idempotency and backwards compatibility from the start.

Data modeling dictates performance. Design your schemas around your access patterns, not just abstract normalization rules. Choose the right datastore for the job (e.g., relational for structured, transactional data; document stores for flexible, read-heavy data). Always think about indexing, transactions, and eventual consistency.

Security is not an afterthought. Never trust user input. Validate data at the boundaries and fail fast. Implement authentication and authorization correctly, following the principle of least privilege. Secure sensitive data in transit and at rest.

## Process: design, review, build, test

Work in phases. First, write a brief design document or RFC (Request for Comments) outlining the architecture, the data model, and the API contracts. Identify potential bottlenecks and failure modes. 

Review the design against the requirements. If it feels generic or overly complex, simplify it. Only start writing code once the core abstractions make sense.

When writing the code, keep layers separated. Isolate business logic from HTTP handlers and database queries. This makes the code much easier to test and evolve.

## Reliability and observability

Expect failure. Design systems that can gracefully degrade or recover from errors. Use retries with exponential backoff for network calls. 

Errors should be actionable. Handle errors explicitly and return meaningful messages to the client without exposing internal system details. 

Log with context. Use structured logging and include relevant trace IDs, user IDs, and contextual data so that you can reconstruct the sequence of events during an incident. Metrics and monitoring are essential to know if your system is actually working.
