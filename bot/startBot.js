import fs from "fs"
import path from "path"
import pino from "pino"
import {
  default as makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys"

import config from "../config.js"
import { loadPlugins } from "./plugins/index.js"

export async function startBot(botId) {
  console.log(`🤖 Starting bot: ${botId}`)

  /* ---------- SESSION INIT ---------- */
  const sessionDir = `./sessions/${botId}`
  const credsFile = path.join(sessionDir, "creds.json")

  if (!fs.existsSync(sessionDir))
    fs.mkdirSync(sessionDir, { recursive: true })

  if (!fs.existsSync(credsFile)) {
    if (!config.SESSION_ID)
      throw new Error("❌ SESSION_ID missing in config.js")

    const decoded =
      Buffer.from(config.SESSION_ID, "base64")

    fs.writeFileSync(credsFile, decoded)
    console.log("🔐 Session restored from SESSION_ID")
  }

  const { state, saveCreds } =
    await useMultiFileAuthState(sessionDir)

  const { version } =
    await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    version,
    logger: pino({ level: "silent" }),
    browser: ["NovaX-MD", "Chrome", "1.0"]
  })

  sock.ev.on("creds.update", saveCreds)

  /* ---------- PLUGINS ---------- */
  const plugins = await loadPlugins()

  /* ---------- MESSAGE HANDLER ---------- */
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg?.message || msg.key.fromMe) return

    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      ""

    if (!body.startsWith(config.prefix)) return

    // Auto-react for command verification
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "⚡", key: msg.key }
    })

    const command =
      body.slice(1).split(" ")[0].toLowerCase()

    for (const plugin of plugins) {
      if (!plugin.command) continue
      if (!plugin.command.includes(command)) continue

      await plugin.run({
        sock,
        msg,
        config,
        plugins
      })
    }
  })

  console.log("✅ Bot connected and ready")
}
