
function runVulnerable() {
    const input = document.getElementById("userInput").value;
    const output = document.getElementById("output");
    const status = document.getElementById("status");

    /*
      Intentionally unsafe rendering is confined to a sandboxed iframe.
      No allow-scripts and no allow-same-origin are granted, so injected
      script/event-handler code cannot execute in the parent page context.
    */
    const frame = document.createElement("iframe");
    frame.className = "output-frame";
    frame.setAttribute("sandbox", "");
    frame.setAttribute("title", "Isolated vulnerable HTML rendering output");
    frame.setAttribute("referrerpolicy", "no-referrer");
    frame.setAttribute("allow", "camera 'none'; microphone 'none'; geolocation 'none'");
    // Parent CSP is inherited. Sandbox grants neither scripts nor same-origin.
    frame.srcdoc = input;

    output.replaceChildren(frame);

    status.className = "status bad";
    status.textContent =
`🔴 VULNERABLE — UNSAFE HTML RENDERING

User input was interpreted as HTML inside an isolated sandbox.

The vulnerable example treats untrusted input as HTML.

SECURITY ISSUE:
HTML supplied by the user is rendered by the browser.

ISOLATION:
The rendered content is separated from the parent application context.`;
}

function runSafe() {
    const input = document.getElementById("userInput").value;
    const output = document.getElementById("output");
    const status = document.getElementById("status");

    output.textContent = input;

    status.className = "status good";
    status.textContent =
`🟢 PROTECTED — SAFE TEXT RENDERING

User input was rendered as text.

The application treated the supplied value as data instead of HTML.

PROTECTION:
The browser did not interpret the user input as HTML.`;
}

document.getElementById("action-0").addEventListener("click", runVulnerable);
document.getElementById("action-1").addEventListener("click", runSafe);