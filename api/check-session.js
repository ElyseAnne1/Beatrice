export default async function handler(req, res) {
  const sitePassword = process.env.BEATRICE_PASSWORD;

  // If no password is configured at all, treat everyone as already signed in
  // so the app still works without a lock screen.
  if (!sitePassword) {
    res.status(200).json({ unlocked: true });
    return;
  }

  const cookieHeader = req.headers.cookie || "";
  const hasValidSession = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .some((c) => c === `beatrice_session=${sitePassword}`);

  res.status(200).json({ unlocked: hasValidSession });
}
