const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
let router = express.Router();
const pino = require('pino');
const {
    default: Fredi,
    useMultiFileAuthState,
    jidNormalizedUser,
    Browsers,
    delay,
    makeInMemoryStore,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, {
        recursive: true,
        force: true
    });
}

const { readFile } = require('node:fs/promises');

router.get('/', async (req, res) => {
    const id = makeid();
    async function FEE_XMD_QR_CODE() {
        const { version } = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Qr_Code_By_Fredi = Fredi({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeInMemoryStore(state.keys, pino({ level: 'silent' }).child({ level: 'silent' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'silent' }).child({ level: 'silent' }),
                browser: ['Ubuntu', 'Chrome'],
                syncFullHistory: false,
                connectTimeoutMs: 60000,
                keepAliveIntervalMs: 30000
            });

            Qr_Code_By_Fredi.ev.on('creds.update', saveCreds);
            Qr_Code_By_Fredi.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect, qr } = s;
                if (qr) await res.end(await QRCode.toBuffer(qr));
                if (connection === 'open') {
                    await Qr_Code_By_Fredi.sendMessage(Qr_Code_By_Fredi.user.id, { text: `
╭
┋❒ Hello! 👋 You're now connected to Andbadtz.

┋❒ Please wait a moment while we generate your session ID. It will be sent shortly... 🙂
╰
` });
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(8000);
                    let b64data = Buffer.from(data).toString('base64');
                    let session = await Qr_Code_By_Fredi.sendMessage(Qr_Code_By_Fredi.user.id, { text: '' + b64data });

                    let FEE_XMD_TEXT = `
📌 *Need Assistance? Reach Out Anytime:*  
• 👑 *Owner:* https://wa.me/255672752355  
• 💬 *Group Chat:* https://chat.whatsapp.com/Foy4FSXyTk8GmazVXQMhHM  
• 📢 *Channel:*  https://whatsapp.com/channel/0029VbBomqO23n3eqFNZGK3K
• 📸 *Instagram:* https://www.instagram.com/frediezra  
• 💻 *GitHub Repo:* https://github.com/kandala20/kandala-xmd1

🧠 *Support kandala Project:*  
⭐ Star & 🍴 Fork the repo to stay updated with new features!

🎄 *#kandala*`;

                    await Qr_Code_By_Fredi.sendMessage(Qr_Code_By_Fredi.user.id, { text: FEE_XMD_TEXT }, { quoted: session });

                    await delay(100);
                    await Qr_Code_By_Fredi.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(5000); 
                    FEE_XMD_QR_CODE();
                }
            });
        } catch (err) {
            console.log('Service restarted due to error:', err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.json({ code: 'Service is Currently Unavailable' });
            }
        }
    }
    return await FEE_XMD_QR_CODE();
});

module.exports = router;
