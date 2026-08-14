# Connect the app to your database (no coding)

This turns on central collection: every completed assessment is saved into your
Supabase database automatically. Respondents do **not** need to log in, and the
secret key stays on the server — never in the browser.

You'll do three things: run one SQL block, add two settings in Vercel, and upload
the updated files. About 15 minutes.

---

## Step 1 — Create the storage table in Supabase (~3 min)

1. Open your project at supabase.com.
2. In the left sidebar, click **SQL Editor → New query**.
3. Open the file `supabase-collect.sql` from your project folder, copy **all** of it,
   paste it into the editor, and click **Run**.
4. You should see "Success." (It's safe to run more than once.)

## Step 2 — Get your two Supabase values (~2 min)

1. In Supabase, go to **Project Settings → API**.
2. Copy the **Project URL** (looks like `https://abcd1234.supabase.co`).
3. Under **Project API keys**, reveal and copy the **service_role** key (labeled
   "secret"). Treat this like a password — it can read and write everything.
   Never put it in GitHub, email, or the app's visible files. It only ever goes
   into Vercel's encrypted settings, which is what the next step does.

## Step 3 — Add the two values to Vercel (~3 min)

1. Open your project on vercel.com → **Settings → Environment Variables**.
2. Add the first:
   - **Key:** `SUPABASE_URL`
   - **Value:** your Project URL from Step 2
   - Environments: **Production** (Preview is fine too) → **Save**
3. Add the second:
   - **Key:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** your service_role key from Step 2
   - Environments: **Production** → **Save**

## Step 4 — Upload the updated files and redeploy (~5 min)

The updated project folder now includes a new file, `api/save-results.js`, plus a
small change to `app.js`. Get them into GitHub so Vercel republishes:

1. Open your repository on github.com.
2. Click **Add file → Upload files**, drag in the updated `app.js` and the whole
   updated `api` folder (which now contains `save-results.js` as well as
   `email-results.js`), and click **Commit changes**.
   - Simplest alternative: delete the repo's contents and re-upload everything
     from the new folder, then commit.
3. Vercel redeploys automatically within about 30 seconds.

---

## Test it

1. Open your live app and complete an assessment through to the results screen.
2. In Supabase, open **Table Editor → submissions**. You should see a new row with
   the company, score, recommended package, and date. That's your first saved result.

Every future submission will appear here. To pull them into a spreadsheet, open the
`submissions` table and use **Export → CSV**.

## What gets saved (and what never does)

Saved: company, line of business, healthcare track, date, program score, maturity,
recommended package, primary focus, confidence, disposition, and the top immediate
priorities — plus the email the respondent entered.

Never saved here: evidence notes, uploaded files, individual question answers, or any
PHI. The endpoint stores only the approved executive summary fields, by design.

## If a row doesn't appear

- Double-check both Vercel variables are spelled exactly as above and set for
  **Production**, then redeploy (Deployments tab → ⋯ → Redeploy).
- Confirm Step 1 ran — in Table Editor you should see a `submissions` table.
- Remember the free database pauses after 7 days of no activity and takes ~30
  seconds to wake on the next request; a submission right after a long idle period
  may take a moment.
