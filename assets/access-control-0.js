
const documents = Object.freeze({
    "101": Object.freeze({
        owner: "Alice",
        content: "Alice private document"
    }),
    "102": Object.freeze({
        owner: "Bob",
        content: "Bob private document"
    })
});

function getDocument(id) {
    return Object.hasOwn(documents, id) ? documents[id] : null;
}

function runVulnerable() {
    const id = document.getElementById("documentId").value.trim();
    const result = document.getElementById("result");

    /*
      The lab remains intentionally vulnerable to IDOR:
      an existing document is returned without checking ownership.
      Object.hasOwn prevents inherited Object.prototype properties such as
      "toString" and "__proto__" from being mistaken for documents.
    */
    const doc = getDocument(id);

    result.className = "result bad";

    if (!doc) {
        result.textContent =
`VULNERABLE REQUEST

HTTP 404
Document not found.`;
        return;
    }

    result.textContent =
`🔴 VULNERABLE — ACCESS GRANTED

GET /api/documents/${id}

HTTP 200 OK

Owner: ${doc.owner}
Content: ${doc.content}

SECURITY ISSUE:
No ownership authorization check was performed.`;
}

function runProtected() {
    const id = document.getElementById("documentId").value.trim();
    const result = document.getElementById("result");
    const doc = getDocument(id);

    result.className = "result good";

    if (!doc) {
        result.textContent =
`🟢 PROTECTED

HTTP 404
Document not found.`;
        return;
    }

    if (doc.owner !== "Alice") {
        result.textContent =
`🟢 PROTECTED — ACCESS DENIED

GET /api/documents/${id}

HTTP 403 Forbidden

Current user: Alice
Resource owner: ${doc.owner}

Authorization check successfully blocked access.`;
        return;
    }

    result.textContent =
`🟢 PROTECTED — ACCESS GRANTED

HTTP 200 OK

Owner: ${doc.owner}
Content: ${doc.content}

Ownership successfully verified.`;
}

document.getElementById("action-0").addEventListener("click", runVulnerable);
document.getElementById("action-1").addEventListener("click", runProtected);