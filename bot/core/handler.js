import { menuCommand } from "../commands/menu.js"

export async function messageHandler(sock, msg) {
  try {
    const m = msg.messages[0]
    if (!m.message) return
    if (m.key.fromMe) return

    const from = m.key.remoteJid
    const body =
      m.message.conversation ||
      m.message.extendedTextMessage?.text

    if (!body) return

    const prefix = "."
    if (!body.startsWith(prefix)) return

    const command = body.slice(1).trim().toLowerCase()

    if (command === "menu") {
      await menuCommand(sock, from)
    }
  } catch (err) {
    console.error("Message handler error:", err)
  }
}
