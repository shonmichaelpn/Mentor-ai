# Security Policy

## Reporting a vulnerability

Please do not open a public GitHub issue for security vulnerabilities.

Instead, use the GitHub Security Advisories feature for this repository to privately report the issue.

If that is not possible, contact the maintainer through the repository owner profile and include:

- a clear description of the vulnerability
- steps to reproduce it
- affected version or commit
- any relevant proof of concept or screenshots

## Response expectations

We aim to review valid reports as quickly as possible and work toward a fix and disclosure timeline that is appropriate for the severity of the issue.

## Best practices

- never commit secrets, tokens, or credentials to the repository
- store environment variables in a secure local environment or deployment provider secret store
- validate user input and authentication checks on all API routes
- keep dependencies updated and review security alerts regularly
