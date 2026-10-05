
function insertInvalid() {
    document.getElementById("jsonInput").value =
`{
  "name": "",
  "age": -500,
  "email": "not-an-email",
  "admin": true
}`;
}

function runVulnerable() {
    const result = document.getElementById("result");
    const input = document.getElementById("jsonInput").value;

    try {
        const data = JSON.parse(input);

        result.className = "result bad";
        result.textContent =
`🔴 VULNERABLE HANDLER

SIMULATED HTTP 201 Created

REQUEST ACCEPTED WITHOUT VALIDATION

${JSON.stringify(data, null, 2)}

SECURITY ISSUE:

Invalid and unexpected values were allowed
to reach application logic.`;

    } catch (error) {
        result.className = "result bad";
        result.textContent =
`🔴 VULNERABLE HANDLER

HTTP 400 Bad Request

Malformed JSON.`;
    }
}

function runProtected() {
    const result = document.getElementById("result");
    const input = document.getElementById("jsonInput").value;

    let data;

    try {
        data = JSON.parse(input);
    } catch (error) {
        result.className = "result good";
        result.textContent =
`🟢 PROTECTED HANDLER

HTTP 400 Bad Request

Malformed JSON rejected.`;
        return;
    }

    /* A valid request body for this lab must be a plain JSON object.
       Reject null, arrays and primitive JSON values before Object.keys(). */
    if (
        data === null ||
        Array.isArray(data) ||
        typeof data !== "object"
    ) {
        result.className = "result good";
        result.textContent =
`🟢 PROTECTED HANDLER

HTTP 422 Unprocessable Entity

REQUEST BLOCKED

Request body must be a JSON object.

Input validation successfully rejected
the unsafe request.`;
        return;
    }

    const errors = [];
    const allowedFields = ["name", "age", "email"];

    Object.keys(data).forEach(key => {
        if (!allowedFields.includes(key)) {
            errors.push("Unexpected field: " + key);
        }
    });

    if (
        typeof data.name !== "string" ||
        data.name.trim().length < 1 ||
        data.name.trim().length > 80
    ) {
        errors.push("Invalid name");
    }

    if (
        !Number.isInteger(data.age) ||
        data.age < 18 ||
        data.age > 120
    ) {
        errors.push("Age must be an integer from 18 to 120");
    }

    if (
        typeof data.email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
        errors.push("Invalid email");
    }

    result.className = "result good";

    if (errors.length > 0) {
        result.textContent =
`🟢 PROTECTED HANDLER

HTTP 422 Unprocessable Entity

REQUEST BLOCKED

${errors.map(error => "• " + error).join("\n")}

Input validation successfully rejected
the unsafe request.`;
        return;
    }

    result.textContent =
`🟢 PROTECTED HANDLER

SIMULATED HTTP 201 Created

VALIDATION PASSED

${JSON.stringify(data, null, 2)}

Request accepted after validation.`;
}

document.getElementById("action-0").addEventListener("click", runVulnerable);
document.getElementById("action-1").addEventListener("click", runProtected);
document.getElementById("action-2").addEventListener("click", insertInvalid);