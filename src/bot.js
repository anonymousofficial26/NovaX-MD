const {
  default: makeWASocket,
  useMultiFileAuthState
} = require('@whiskeysockets/baileys')
const Pino = require('pino')
const fs = require('fs')

const handler = require('./handler')

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')

  const sock = makeWASocket({
    auth: state,
    logger: Pino({ level: 'silent' }),
    browser: ['WhatsApp Bot', 'Chrome', '1.0']
  })

  sock.ev.on('creds.update', saveCreds)

  // Always online
  setInterval(() => {
    sock.sendPresenceUpdate('available')
  }, 10000)

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    // Auto view status
    if (msg.key.remoteJid === 'status@broadcast') {
      await sock.readMessages([msg.key])
      return
    }

    // Download view-once
    if (msg.message?.viewOnceMessageV2) {
      const buffer = await sock.downloadMediaMessage(msg)
      fs.writeFileSync(`media/viewonce_${Date.now()}.jpg`, buffer)
    }

    await handler(sock, msg)
  })
}

startBot()

