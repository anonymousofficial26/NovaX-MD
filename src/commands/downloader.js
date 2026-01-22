const fs = require('fs')
const axios = require('axios')
const ytdl = require('ytdl-core')

module.exports = {
  name: 'music',
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid
    const url = args[0]
    if (!url) return

    const file = `media/audio/${Date.now()}.mp3`

    ytdl(url, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(file))
      .on('finish', async () => {
        await sock.sendMessage(chatId, {
          audio: fs.readFileSync(file),
          mimetype: 'audio/mpeg'
        })
      })
  }
}
