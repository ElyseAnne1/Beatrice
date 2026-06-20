export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const sitePassword = process.env.BEATRICE_PASSWORD;
  if (!sitePassword) {
    res.status(500).json({ error: "Server is missing BEATRICE_PASSWORD." });
    return;
  }

  const { password } = req.body || {};

  if (!password || password !== sitePassword) {
    res.status(401).json({ error: "Wrong password." });
    return;
  }

  // One year session cookie, httpOnly so it can't be read by page scripts,
  // secure + sameSite so it only ever travels over https on this site.
  const oneYearSeconds = 60 * 60 * 24 * 365;
  res.setHeader(
    "Set-Cookie",
    `beatrice_session=${sitePassword}; Max-Age=${oneYearSeconds}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );
  res.status(200).json({ ok: true });
}
