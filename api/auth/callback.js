export default async function handler(req, res) {
    const { code, state, error } = req.query;

    if (error) {
        return res.redirect(302, `/verify.html?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
        return res.redirect(302, `/verify.html?error=no_code`);
    }

    const discordId = state || '';

    const verifyCode = Buffer.from(
        JSON.stringify({
            code: code,
            discord_id: discordId,
            ts: Date.now(),
            rand: Math.random().toString(36).substring(2, 10)
        })
    ).toString('base64');

    return res.redirect(302, `/verify.html?code=${encodeURIComponent(verifyCode)}`);
}
