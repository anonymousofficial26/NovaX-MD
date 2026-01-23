import fs from "fs"

const plugins = []

export function loadPlugins() {
  const files = fs.readdirSync("./bot/plugins")
  for (const file of files) {
    if (file === "index.js") continue
    const plugin = require(`./${file}`)
    plugins.push(plugin.default)
  }
}

export function getPlugins() {
  return plugins
}
