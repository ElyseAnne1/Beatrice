# Beatrice — setup guide

This is a step by step guide. You don't need to know how to code. You're just
going to copy files into two free websites, the same way you did with ViviSew.

There are 4 stages:
1. Get one API key (this is like a password that lets the app talk to Claude)
2. Put these files on GitHub
3. Connect GitHub to Vercel (this is what actually hosts the app)
4. Add it to your phone's home screen

Take your time. Each stage only needs to be done once.

---

## Stage 1: Get your Anthropic API key

This key lets Beatrice send your text to Claude and get a draft back. It is
tied to a small amount of money you load on, billed in pennies per use.

1. Go to **console.anthropic.com** in your browser
2. Sign in (or create an account if you don't have one)
3. Look for **Settings** (usually on the left side), then **Billing**
4. Add a credit card and load a small balance — $5 to $10 is plenty to start
5. Still in Settings, find **API Keys**
6. Click **Create Key**
7. Name it "Beatrice"
8. Copy the long string of letters and numbers it gives you, and paste it
   somewhere safe (like a Notes app) — you will not be able to see it again
   after you leave that page

You now have your key. Keep that note handy — you'll need it in Stage 3.

---

## Stage 2: Put the files on GitHub

GitHub is just a place to store the app's files so Vercel can find them.
This is the same process you used for ViviSew.

1. Go to **github.com** and sign in
2. Create a **new repository** — make it **private**, name it "beatrice"
3. You should now have an empty repository
4. Upload these files, keeping them in the same folders shown below:

```
beatrice/
├── index.html
├── package.json
├── .gitignore
└── api/
    └── sort.js
```

The important part: `sort.js` must end up **inside a folder literally named
`api`**, not loose at the top level. If GitHub's upload screen doesn't let
you create a folder, you can usually just drag the whole `api` folder in and
it will keep its structure — or upload `sort.js` and then rename it to
`api/sort.js` after uploading.

---

## Stage 3: Connect to Vercel

Vercel takes your GitHub files and turns them into a real, working website.

1. Go to **vercel.com** and sign in using your GitHub account (this links
   the two automatically)
2. Click **Add New** → **Project**
3. Find your "beatrice" repository in the list and click **Import**
4. Before you click the final Deploy button, look for a section called
   **Environment Variables** — this is where your API key from Stage 1 goes
5. Add one:
   - Name: `ANTHROPIC_API_KEY`
   - Value: paste the key you saved earlier
6. Click **Deploy**
7. Wait about a minute. Vercel will give you a working web address
   (something like `beatrice-xyz.vercel.app`)

---

## Stage 4: Put it on your phone

1. Open that Vercel web address in **Safari** on your iPhone (must be
   Safari, not Chrome, for this step)
2. Tap the **Share** button (the square with the arrow pointing up)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add**

You'll now have a "beatrice" icon on your home screen that opens full-screen,
like a real app.

---

## How to actually use it

1. Open Beatrice
2. Type your dump, or paste in a transcript (Voice Memos can transcribe
   your recordings for you — record there, then copy the text and paste it
   into Beatrice)
3. Tap **Sort this**
4. Beatrice tells you what it is (stand-up bit, book chapter, or Substack)
   and gives you a first draft
5. Tap **Copy draft** to grab the text, or tap one of the other category
   buttons to see it rewritten a different way

---

## If something goes wrong

- **The app loads but "Sort this" gives an error** — almost always means the
  API key wasn't entered correctly in Stage 3. Go back to Vercel → your
  project → Settings → Environment Variables and double check it.
- **GitHub upload looks confusing** — you can always come back here and ask,
  and walk through it together step by step, the same way we did with ViviSew.
