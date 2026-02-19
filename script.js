/** * T-COIN SECURITY PROTOCOL - LEAD ARCHITECT VERSION
 * Integrated with Two-Man Integrity and DMS Lockdown
 */

const SECURITY_CREDENTIALS = {
    "officer1": "dutyfree",
    "officer2": "dutyfree1",
    "dutyfree": "dutyfree",   // Admin/Backup
    "dutyfree1": "dutyfree1"  // Admin/Backup
};

const DMS_STORAGE_KEY = 'tcoin_dms_last_confirm';
const logs = [];

/**
 * 1. CORE VALIDATION
 * Checks if the ID exists and the password matches.
 */
function validateOfficer(id, providedPw) {
    const normalizedId = id.trim().toLowerCase();
    return SECURITY_CREDENTIALS[normalizedId] && SECURITY_CREDENTIALS[normalizedId] === providedPw;
}

/**
 * 2. DEAD MAN'S SWITCH (DMS) LOGIC
 * Manages the 30-day safety timer.
 */
function checkDMSStatus() {
    const dataStr = localStorage.getItem(DMS_STORAGE_KEY);
    const statusEl = document.getElementById('dmsStatus');
    const containerEl = document.querySelector('.container');
    
    if (!dataStr) {
        setLockdown(statusEl, containerEl, "NO RECORD - SYSTEM LOCKED");
        return false;
    }
    
    const data = JSON.parse(dataStr);
    const lastPulse = new Date(data.timestamp);
    const diffDays = (new Date() - lastPulse) / (1000 * 3600 * 24);

    if (diffDays > 30) {
        setLockdown(statusEl, containerEl, `EXPIRED (${Math.floor(diffDays)} days) - LOCKED`);
        return false;
    }
    
    // System is Healthy
    statusEl.textContent = `Operational (Verified by: ${data.officer})`;
    statusEl.style.color = "#00ff00"; // Neon Green
    containerEl.style.borderColor = "#00ff00";
    return true;
}

function setLockdown(el, container, msg) {
    el.textContent = msg;
    el.style.color = "#ff0000"; // Emergency Red
    container.style.borderColor = "#ff0000";
}

/**
 * 3. TRANSACTION APPROVAL (TWO-MAN INTEGRITY)
 * Requires synchronized input from two different authorized accounts.
 */
document.getElementById('createApprovalRequest').onclick = () => {
    // Prevent actions if DMS is expired
    if (!checkDMSStatus()) {
        return alert("CRITICAL ERROR: System in Lockdown. Reset Dead Man's Switch first.");
    }

    const off1 = document.getElementById('officer1').value;
    const pw1 = document.getElementById('officer1_pw').value;
    const off2 = document.getElementById('officer2').value;
    const pw2 = document.getElementById('officer2_pw').value;

    // Validation Flow
    if (validateOfficer(off1, pw1) && validateOfficer(off2, pw2)) {
        if (off1.toLowerCase() === off2.toLowerCase()) {
            return alert("SECURITY ALERT: Signature 1 and Signature 2 must be from different officers.");
        }
        
        const action = document.getElementById('action-select').value;
        
        // Log the authorized event
        const newEntry = {
            timestamp: new Date().toLocaleString(),
            action: action.toUpperCase().replace('_', ' '),
            status: "SUCCESS",
            officers: [off1, off2]
        };
        
        logs.unshift(newEntry); // Add to top of list
        renderLogs();
        clearInputs(['officer1', 'officer1_pw', 'officer2', 'officer2_pw']);
        alert(`SUCCESS: ${newEntry.action} has been authorized and broadcast to T-Coin ledger.`);
    } else {
        alert("ACCESS DENIED: Invalid credentials for one or both officers.");
    }
};

/**
 * 4. PRESENCE CONFIRMATION
 * Resets the 30-day timer using any authorized ID/PW.
 */
document.getElementById('confirmPresenceBtn').onclick = () => {
    const id = document.getElementById('dmsOfficer').value;
    const pw = prompt(`Officer Identity Verification Required for ${id}:`);

    if (validateOfficer(id, pw)) {
        localStorage.setItem(DMS_STORAGE_KEY, JSON.stringify({
            officer: id,
            timestamp: new Date().toISOString()
        }));
        checkDMSStatus();
        alert(`DMS PULSE RECEIVED. System security timer reset by ${id}.`);
        document.getElementById('dmsOfficer').value = '';
    } else {
        alert("IDENTITY VERIFICATION FAILED.");
    }
};

/**
 * 5. UI RENDERING
 */
function renderLogs() {
    const container = document.getElementById('actionLog');
    if (logs.length === 0) {
        container.innerHTML = '<p class="empty-msg">No recent activity recorded.</p>';
        return;
    }

    container.innerHTML = logs.map(log => `
        <div class="log-entry animated-slide-in">
            <span class="log-time">[${log.timestamp}]</span>
            <span class="log-action">${log.action}</span>
            <span class="log-status">${log.status}</span>
            <div class="log-signatories">Auth: ${log.officers.join(' + ')}</div>
        </div>
    `).join('');
}

function clearInputs(ids) {
    ids.forEach(id => document.getElementById(id).value = '');
}

// Start System
window.onload = () => {
    checkDMSStatus();
    renderLogs();
};
