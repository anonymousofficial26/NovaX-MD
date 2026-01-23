export default {
  command: ["menu"],
  desc: "Show bot menu",

  run: async ({ sock, msg, config }) => {
    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text

    if (text !== ".menu") return

    const menuImageUrl = "https://files.catbox.moe/2klf23.png"

    const caption = `
╔═════〔 🤖 ${config.botName || "NovaX-MD"} 〕═════╗

📥 *DOWNLOAD*
• .ytmp3 <link>
• .ytmp4 <link>
• .tiktok <link>
• .image <name>

🎬 *CONVERT*
• .tomp3 (reply audio)
• .tovn (reply video)
• .sticker (reply image)

👥 *GROUP*
• .tagall
• .kick @user
• .add +number

👑 *ADMIN*
• .promote @user
• .demote @user

⚙ *SYSTEM*
• .menu
• .ping
• .update

╚══════════════════════╝
${config.botName || "NovaX-MD"} • Multi-Function WhatsApp Bot
`

    await sock.sendMessage(
      msg.key.remoteJid,
      {
        image: { url: menuImageUrl },
        caption
      },
      { quoted: msg }
    )
  }
}

