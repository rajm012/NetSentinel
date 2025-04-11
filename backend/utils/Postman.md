### 1. Add these new endpoints to your API:

1. **GET /api/alerts/**
   - Retrieve all alerts with optional filtering
   - Query parameters:
     - `limit`: Number of alerts to return (default: 100)
     - `severity`: Filter by severity level
   - Returns:
     ```json
     {
       "alerts": [
         {
           "type": "string",
           "message": "string",
           "severity": "string",
           "timestamp": "string"
         }
       ],
       "count": 0,
       "last_updated": "string"
     }
     ```

2. **POST /api/alerts/**
   - Log a manual alert
   - Request body:
     ```json
     {
       "type": "string",
       "message": "string",
       "severity": "string"
     }
     ```
   - Returns:
     ```json
     {
       "status": "string",
       "message": "string"
     }
     ```

3. **DELETE /api/alerts/**
   - Clear all alerts from the log
   - Returns:
     ```json
     {
       "status": "string",
       "message": "string"
     }
     ```
