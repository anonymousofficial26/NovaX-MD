export async function menuCommand(sock, jid) {
  const menuText = `
╭───「 🤖 NovaX-MD 」───
│
│ .menu
│ .ping
│ .alive
│
│ *Downloads*
│ .song <name>
│ .video <name>
│ .apk <name>
│
│ *Groups*
│ .kick
│ .add
│ .tagall
│
│ *Admins*
│ .ban
│ .unban
│
╰───────────────
`

  await sock.sendMessage(jid, {
    image: { url: "https://files.catbox.moe/2klf23.png" },
    caption: menuText
  })
}
