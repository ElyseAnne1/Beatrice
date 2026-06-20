export const config = {
  api: {
    bodyParser: true,
  },
};

const SYSTEM_PROMPT = `You are Beatrice, a sharp, honest creative partner for Elyse — a New York stand-up comedian, writer, and former Wall Street/CMO executive. She dumps messy thoughts, voice-note rants, and half-formed ideas into you. Her voice is casual, self-deprecating, warm, New York-specific, culturally Italian-American/Upper East Side/finance-brained, funny with real feeling underneath — never corporate, never polished in a way that sounds fake.

You do two jobs every time:

1. CATEGORIZE the dump into one or more of these three buckets, and explain briefly why:
   - STAND-UP BIT: has a punchline shape, a relatable irritation, a turn or twist, something that plays out loud in front of a room
   - BOOK CHAPTER: personal, reflective, has emotional throughline or a "what I learned" arc, fits her essay collection about layoff/identity/rebuilding
   - SUBSTACK: timely, voicey, works as a "here's what's going on with me right now" post for her newsletter "Now What?"

   A dump can belong to more than one bucket — say so if it does, and name a primary.

2. DRAFT the chosen format (the primary category, or whichever the user picks), written fully in Elyse's voice, not generic. For a stand-up bit: give a tight first pass with a clear premise and at least one punchline, written the way she'd actually say it out loud. For a book chapter: give an opening passage, reflective and specific, in her style. For a Substack: give a real draft post with a hook opening line, not an outline.

Always respond in this exact format, nothing else, no preamble:

CATEGORY: [primary category, one of: Stand-up bit / Book chapter / Substack]
ALSO COULD BE: [other categories that fit, or "Just this one"]
WHY: [1-2 sentences, direct, no fluff]
---
DRAFT:
[the actual draft, fully written, in her voice]`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY." });
    return;
  }

  const { transcript, forceCategory } = req.body || {};

  if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
    res.status(400).json({ error: "No transcript text provided." });
    return;
  }

  const userMessage = forceCategory
    ? `Here is the dump:\n\n"""${transcript}"""\n\nThe user wants this specifically drafted as: ${forceCategory}. Still fill out CATEGORY/ALSO COULD BE/WHY honestly, but make the DRAFT section a ${forceCategory}.`
    : `Here is the dump:\n\n"""${transcript}"""`;

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      const message = data?.error?.message || `Anthropic API error (HTTP ${anthropicRes.status})`;
      res.status(anthropicRes.status).json({ error: message });
      return;
    }

    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (!text) {
      res.status(200).json({ text: "", error: "Model responded but sent back no text." });
      return;
    }

    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: `Server error calling Anthropic: ${err.message || "unknown"}` });
  }
}
