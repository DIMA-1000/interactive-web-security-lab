
function insertExample() {
    document.getElementById("username").value =
        "alice' OR '1'='1";
}

function runVulnerable() {
    const value = document.getElementById("username").value;
    const result = document.getElementById("result");

    const query =
        "SELECT id, username FROM users WHERE username = '" +
        value +
        "'";

    result.className = "result bad";

    result.textContent =
`🔴 VULNERABLE — STRING CONCATENATION

Generated SQL:

${query}

SECURITY ISSUE:

User-controlled input was inserted directly
into the SQL statement.

SQL syntax and user data are not safely separated.`;
}

function runProtected() {
    const value = document.getElementById("username").value;
    const result = document.getElementById("result");

    result.className = "result good";

    result.textContent =
`🟢 PROTECTED — PARAMETERIZED QUERY

SQL:

SELECT id, username
FROM users
WHERE username = ?

Parameter:

${JSON.stringify(value)}

SECURE BEHAVIOR:

The SQL structure remains unchanged.

User input is handled as data,
not executable SQL syntax.`;
}

document.getElementById("action-0").addEventListener("click", runVulnerable);
document.getElementById("action-1").addEventListener("click", runProtected);
document.getElementById("action-2").addEventListener("click", insertExample);