
### API Endpoints Summary:

<!-- Base Url: http://localhost:8000/api/config -->

1. **GET /thresholds**  
   - Returns all threshold values
   - Response: `{"PORT_SCAN": 100, "ARP_SPOOF": 5, ...}`

2. **POST /thresholds/update**  
   - Updates a threshold value
   - Request body: `{"key": "PORT_SCAN", "value": 150}`
   - Response: `{"status": "success", "updated": {"PORT_SCAN": 150}}`

3. **GET /rules**  
   - Lists all available rule files
   - Response: `["arp_spoof", "dns_tunneling", "port_scan"]`

4. **GET /rules/{rule_name}**  
   - Gets a specific rule configuration
   - Response: 
     ```json
     {
       "name": "port_scan",
       "type": "yaml",
       "content": {
         "port_scan": {
           "ports_threshold": 100,
           "time_window": 10
         }
       }
     }
     ```

5. **GET /settings**  
   - Returns current application settings
   - Response: `{"LOG_FILE": "logs/sniffer.log", "DEFAULT_INTERFACE": "Wi-Fi", ...}`

