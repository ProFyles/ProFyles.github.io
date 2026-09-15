// ==========================================
// DISCORD OAUTH CALLBACK
// Vercel Serverless Function
// ==========================================

export default async function handler(req, res) {
    const { code, state, error } = req.query;

    // Handle errors from Discord
    if (error) {
        return res.redirect(302, `/verify.html?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
        return res.redirect(302, `/verify.html?error=no_code`);
    }

    // Generate a simple verification code
    // (You can make this more secure with JWT)
    const verifyCode = Buffer.from(
        JSON.stringify({
            code: code,
            ts: Date.now(),
            rand: Math.random().toString(36).substring(2, 10)
        })
    ).toString('base64');

    // Redirect to verify.html with the code
    return res.redirect(302, `/verify.html?code=${encodeURIComponent(verifyCode)}`);
}
