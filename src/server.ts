import app from "./app";
import https from "https"
import fs from "fs"

const PORT = process.env.PORT || 3000;
let keyPath = "/etc/letsencrypt/live/theophane-girard.site/privkey.pem"
let certPath = "/etc/letsencrypt/live/theophane-girard.site/fullchain.pem"
let caPath = "/etc/letsencrypt/live/theophane-girard.site/chain.pem"

let key = fs.existsSync(keyPath)
let cert = fs.existsSync(certPath)
let ca = fs.existsSync(caPath)

if (key && cert && ca) {
  https.createServer(
    {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
      ca: fs.readFileSync(caPath),
    },
    app
  )
  console.log(`app listening on port ${PORT} with https!`)
} else {
  app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
}