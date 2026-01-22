export default async (sock, msg) => {
  if (!msg.message.conversation?.startsWith(".tagall")) return
  const meta = await sock.groupMetadata(msg.key.remoteJid)
  const ids = meta.participants.map(p => p.id)
  await sock.sendMessage(msg.key.remoteJid, {
    text: ids.map(u => `@${u.split("@")[0]}`).join(" "),
    mentions: ids
  })
}
