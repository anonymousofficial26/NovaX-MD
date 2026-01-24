export default {
  command: ["menu"],
  category: "system",
  desc: "Show all commands",

  async run({ sock, msg, config, plugins }) {
    const groups = {}

    for (const p of plugins) {
      const cat = (p.category || "others").toUpperCase()
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(p)
    }

    let caption =
`╔═════〔 🤖 ${config.botName} 〕═════╗\n`

    for (const cat in groups) {
      caption += `\n🔹 *${cat}*\n`
      for (const p of groups[cat]) {
        caption +=
          `• .${p.command[0]} — ${p.desc}\n`
      }
    }

    caption +=
`\n╚══════════════════════╝
powered by anonymous`

    await sock.sendMessage(
      msg.key.remoteJid,
      {
        image: { url: "https://files.catbox.moe/2klf23.png" },
        caption
      },
      { quoted: msg }
    )
  }
}
