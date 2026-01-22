export default async (sock, msg) => {
  const text = msg.message.conversation || ""
  const [cmd] = text.split(" ")

  if (cmd === ".tiktok")
    await sock.sendMessage(msg.key.remoteJid, { text: "⬇️ TikTok downloading…" })

  if (cmd === ".image")
    await sock.sendMessage(msg.key.remoteJid, { text: "🖼 Image fetched" })
}
