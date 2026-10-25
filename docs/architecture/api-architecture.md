# API Architecture

The WanderAI backend exposes a RESTful API versioned under `/api/v1`.

## Core Architectural Patterns
- **Controller-Service-Repository Pattern**:
  - `Routes` declare URLs, HTTP verbs, and dependency injection.
  - `Controllers` process requests, invoke services, and return standardized `ApiResponse[T]`.
  - `Services` implement core business rules, date logic, and AI prompt pipelines.
  - `Repositories` abstract database access, providing seamless Supabase integration with automatic fallback.

## Standardized Response Envelope
All endpoints return JSON formatted with standard envelopes:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "error": null
}
```

Error format:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "TRIP_NOT_FOUND",
    "message": "Trip with ID ... was not found"
  }
}
```
