import fs from "fs"

export default async function loadPlugins() {
  const files = fs.readdirSync("./bot/plugins")
  return Promise.all(
    files.map(f => import(`./plugins/${f}`).then(m => m.default))
  )
}
