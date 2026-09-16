# Manual Test Cases

This document outlines the manual test cases for the Electronics Component Inventory API. These match the requests in the `postman_collection.json`.

## 1. Create Component (Valid)
- **Action**: Send POST to `/api/components` with valid name, category, quantity, and location.
- **Expected Result**: HTTP 201 Created. Returns the new component JSON object containing an auto-incremented `id` and `date_added` timestamp.

## 2. Create Component (Missing Fields)
- **Action**: Send POST to `/api/components` missing required fields (e.g. only passing `name`).
- **Expected Result**: HTTP 400 Bad Request. Returns JSON error: `{"error": "Missing required fields"}`.

## 3. Create Component (Duplicate)
- **Action**: Send POST to `/api/components` with a `name` and `category` that already exist in the database.
- **Expected Result**: HTTP 409 Conflict. Returns JSON error: `{"error": "Duplicate component: name and category must be unique"}`.

## 4. Get All Components
- **Action**: Send GET to `/api/components`.
- **Expected Result**: HTTP 200 OK. Returns a JSON array containing all created components.

## 5. Get One Component (Valid)
- **Action**: Send GET to `/api/components/<valid_id>`.
- **Expected Result**: HTTP 200 OK. Returns the JSON object corresponding to that ID.

## 6. Get One Component (Invalid)
- **Action**: Send GET to `/api/components/999` (assuming 999 does not exist).
- **Expected Result**: HTTP 404 Not Found. Returns JSON error: `{"error": "Component not found"}`.

## 7. Update Component (Valid)
- **Action**: Send PUT to `/api/components/<valid_id>` changing fields like `quantity` or `location`.
- **Expected Result**: HTTP 200 OK. Returns the updated component JSON object.

## 8. Update Component (Invalid ID)
- **Action**: Send PUT to `/api/components/999`.
- **Expected Result**: HTTP 404 Not Found. Returns JSON error: `{"error": "Component not found"}`.

## 9. Delete Component (Valid)
- **Action**: Send DELETE to `/api/components/<valid_id>`.
- **Expected Result**: HTTP 200 OK. Returns JSON message: `{"message": "Deleted successfully"}`. Further GET requests for this ID should return 404.

## 10. Delete Component (Invalid)
- **Action**: Send DELETE to `/api/components/999`.
- **Expected Result**: HTTP 404 Not Found. Returns JSON error: `{"error": "Component not found"}`.
