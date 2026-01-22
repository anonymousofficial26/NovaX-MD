export default async (sock, msg) => {
  if (msg.message.imageMessage)
    await sock.sendMessage(msg.key.remoteJid, {
      sticker: msg.message.imageMessage
    })
}
