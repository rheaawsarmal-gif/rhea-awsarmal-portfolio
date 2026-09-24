import fs from "node:fs";
import { spawn } from "node:child_process";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;

async function run() {
  console.log("Starting Chrome with remote debugging on port", PORT);
  const chrome = spawn(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    `--remote-debugging-port=${PORT}`,
    "--window-size=1440,900",
    "http://localhost:3000"
  ]);

  // Wait for Chrome to initialize
  await new Promise(r => setTimeout(r, 3000));

  try {
    // Get debugger target
    const res = await fetch(`http://127.0.0.1:${PORT}/json`);
    const targets = await res.json();
    const pageTarget = targets.find(t => t.type === "page");
    if (!pageTarget) throw new Error("No page target found");

    console.log("Connecting to WebSocket:", pageTarget.webSocketDebuggerUrl);
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const parsed = JSON.parse(event.data);
          if (parsed.id === id) {
            ws.removeEventListener("message", handler);
            resolve(parsed.result);
          }
        };
        ws.addEventListener("message", handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    // Wait 3.5s for initial load and preloader fade
    console.log("Waiting for preloader...");
    await new Promise(r => setTimeout(r, 3500));

    async function capture(name, scrollY) {
      if (scrollY !== undefined) {
        await send("Runtime.evaluate", {
          expression: `window.scrollTo({ top: ${scrollY}, behavior: 'instant' });`
        });
        // Give time for scroll event and frame render
        await new Promise(r => setTimeout(r, 800));
      }
      const { data } = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(`${name}.png`, Buffer.from(data, "base64"));
      console.log(`Saved ${name}.png (scrollY: ${scrollY})`);
    }

    // Capture each stage of the scrollytelling journey
    // Total container height is 500vh (4500px in a 900px viewport, scrollable 3600px)
    await capture("scroll_stage_1_hero", 0);
    await capture("scroll_stage_2_vision", 1100);
    await capture("scroll_stage_3_craft", 2200);
    await capture("scroll_stage_4_coffee", 3200);
    await capture("scroll_stage_5_projects", 4400);

    ws.close();
    console.log("All screenshots successfully captured!");
  } catch (err) {
    console.error("CDP Error:", err);
  } finally {
    chrome.kill();
  }
}

run();
