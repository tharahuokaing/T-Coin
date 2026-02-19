========================================================================
             T-COIN SECURITY DASHBOARD & CENTRALIZED LEDGER
                     Version: 2.0 (2026 Edition)
========================================================================

1. OVERVIEW
-----------
The T-Coin Security Dashboard is a centralized authorization layer designed 
to manage high-value transactions across the T-Coin ecosystem (Casino, 
Bank, Restaurant, AI). It implements "Two-Man Integrity" (2MI) and a 
30-day "Dead Man's Switch" (DMS) to prevent unauthorized ledger access.

2. CORE COMPONENTS
------------------
- index.html:  The UI layer featuring a high-tech holographic interface.
- styles.css:  The visual engine with 7-color LED borders and neon effects.
- script.js:   The authorization logic and client-side credential check.
- server.js:   The Node.js backend managing the in-memory encrypted ledger.

3. SECURITY PROTOCOLS
---------------------
- TWO-MAN INTEGRITY (2MI):
  Critical actions (Withdrawals/Overrides) require simultaneous login 
  from two distinct security officers.
  - Officer 1 (Primary): dutyfree
  - Officer 2 (Secondary): dutyfree1

- DEAD MAN'S SWITCH (DMS):
  One officer must verify their presence every 30 days. If the pulse 
  fails, the server enters "HARD LOCKDOWN" mode, disabling all 
  outbound transactions and ledger edits.

- ENCRYPTION:
  The system uses AES-256-CBC to encrypt transaction details before 
  they are committed to the audit trail.

4. INSTALLATION & SETUP
-----------------------
A. BACKEND SETUP (server.js):
   1. Install Node.js.
   2. Run: npm install express jsonwebtoken body-parser crypto cors
   3. Execute: node server.js (API starts on port 4000).

B. FRONTEND SETUP (GitHub Pages):
   1. Upload index.html, styles.css, and script.js to your repository.
   2. Ensure script.js points to your hosted server.js IP/URL.

5. CREDENTIALS (DEFAULT)
------------------------
- OFFICER_ID_1: dutyfree  | PASS: dutyfree
- OFFICER_ID_2: dutyfree1 | PASS: dutyfree1

6. TECHNICAL SPECIFICATIONS
---------------------------
- Ledger Type: In-Memory Map (High-Speed Performance)
- Auth Type: JWT (JSON Web Tokens)
- UI: CSS3 Conic-Gradients & Keyframe Animations
- Port: 4000 (Default)

7. MAINTENANCE
--------------
Ensure that the server.js is hosted on a platform with persistent 
environment variables for the AES_KEY and JWT_SECRET. In the current 
In-Memory version, restarting the server will reset all balances.

========================================================================
               AUTHORIZED USE ONLY - T-COIN SECURITY 2026
========================================================================
