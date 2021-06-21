import { exec } from "child_process"
import { Response } from "express";
import { CONFIG } from "../config/config";
import crypto, { BinaryLike } from "crypto"

export class CoreController {

  onDeployEvent(req: Request|any, res: Response) {
    if (!req.body) {
      return
    }
    if (!req.body.pusher) {
      return
    }
    if (!req.headers.get('x-hub-signature')) {
      return
    }
    const comparison_signature = this.createComparisonSignature(req.body);

    if (!this.compareSignatures(req.headers.get('x-hub-signature'), comparison_signature)) {
      return res.status(401).send(CONFIG.badRequestMessage);
    }

    console.log(`${req.body.pusher.name} just pushed to ${req.body.repository.name}`)
    console.log('pulling code from GitHub')
    exec('git -C /var/www/inter-detector-api reset --hard', this.execCallback)
    exec('git -C /var/www/inter-detector-api reset --clean -df', this.execCallback)
    exec('git -C /var/www/inter-detector-api reset pull -f', this.execCallback)
    exec('npm -C /var/www/inter-detector-api i --production', this.execCallback)
    exec('tsc', this.execCallback)
    res.status(200).json({msg: 'ok'})
    res.end()
  }

  execCallback(err, stdout, stderr) {
    if (stdout) {
      console.log(stdout)
    }
    if (stderr) {
      console.log(stderr)
    }
  }

  createComparisonSignature(body) {
    let secret: BinaryLike = process.env.DEPLOY_SECRET as BinaryLike
    const hmac = crypto.createHmac('sha1', secret);
    const self_signature = hmac.update(JSON.stringify(body)).digest('hex');
    return `sha1=${self_signature}`; // shape in GitHub header
  }

  compareSignatures(signature, comparison_signature) {
    const source = Buffer.from(signature);
    const comparison = Buffer.from(comparison_signature);
    return crypto.timingSafeEqual(source, comparison); // constant time comparison
  }
}