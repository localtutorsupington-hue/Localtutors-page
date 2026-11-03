# 20 Min Math Error Assessors: landing page with lead saving

This page lets a parent ask for free access to all our maths quizzes for one grade.
When a parent taps the button, three things happen at once:

1. The lead is **emailed** to localtutors.upington@gmail.com (through a free service called FormSubmit).
2. The lead is **saved in Supabase**, in a table called `error_assessor_leads`.
3. **WhatsApp opens** with the message ready to send, just like before.

Saving happens in the background. If the email or Supabase ever fails, WhatsApp still opens. You never lose the chat.

## What is in this folder

| File | What it is |
| --- | --- |
| `site/index.html` | The landing page. This is the only file you put online. |
| `supabase/error-assessor-leads.sql` | Creates the Supabase table. You run it once. |

You do the setup once. A computer is easiest for setup. After that, leads arrive in your email on your phone.

---

## Step 1: Wake up your Supabase project

Your Supabase projects are **paused**. The free plan pauses a project after about a week with no visits.
While it is paused, nothing is saved there. This also affects the Mark Leak Finder sign-ups.

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. Open the project called **localtutors-sign-up**.
3. Click **Restore project** and wait a few minutes until it says it is healthy.

**Keep it awake:** on the free plan it pauses again after about a week without visits. Email still works while it is paused, but Supabase misses those leads.
Running ads keeps it busy. If you go quiet for a while, open the dashboard now and then, or move to a paid plan, which never pauses.

## Step 2: Create the leads table

1. In the project, click **SQL Editor** in the left menu, then **New query**.
2. Open `supabase/error-assessor-leads.sql` from this folder. Copy everything in it.
3. Paste it into the editor and click **Run**. You should see "Success. No rows returned".

That's it. The page already knows your project address and its public key.
The public key is safe in the page: it can only **add** leads. Nobody can read, change or delete them with it.

## Step 3: Put the page online with Netlify

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and sign in (or sign up for free).
2. Drag the whole **`site`** folder from your computer onto the page.
3. Wait a few seconds. Netlify gives you a web address, something like `https://random-name-123.netlify.app`.

**To pick a nicer name:** in Netlify go to **Site configuration**, then **Change site name**.

**To update the page later:** in Netlify, open your site, go to **Deploys**, and drag the `site` folder onto the box that says "Drag and drop your site output folder here".

## Step 4: Switch on the emails (once only)

FormSubmit must check that the email address really is yours before it sends leads to it.

1. Open your new Netlify address and send yourself a **test lead**: fill in a name, surname, grade and language, then tap the button.
2. Check the inbox of localtutors.upington@gmail.com (and the spam folder) for an email from FormSubmit. Tap **Activate Form**.
3. Send a **second test lead**. This one arrives as an email with the subject "New lead: ...". The first test lead is not emailed; it only switched the form on.
4. In Supabase, open **Table Editor** and then **error_assessor_leads**. Your test leads are there. You can delete them.

**Optional, recommended:** the activation email also gives you a random code that looks like `a1b2c3d4e5...`.
Using it hides your email address from spammers who read web pages:

1. Open `site/index.html` in a plain text editor (Notepad on Windows, TextEdit on Mac).
2. Near the top of the script, find this line:

   ```js
   const LEADS_EMAIL = "localtutors.upington@gmail.com";
   ```

3. Replace only the email address with the code. Keep the quote marks.
4. Save, then drag the `site` folder onto Netlify again.

## Step 5: Track your Facebook ads with a UTM link

A UTM link is your normal page address with a small label on the end. The label tells you where each lead came from.
It shows up in the email and in the `utm_source`, `utm_medium` and `utm_campaign` columns in Supabase.

Take your Netlify address and add the label to the end:

```
https://your-site.netlify.app/?utm_source=facebook&utm_campaign=error-assessors
```

Use this full link as the website URL in your Facebook ad. Leads from that ad will show **facebook** and **error-assessors**.

Some more examples:

| Where you share it | Link ending |
| --- | --- |
| Facebook ad | `?utm_source=facebook&utm_medium=paid&utm_campaign=error-assessors` |
| Instagram ad | `?utm_source=instagram&utm_medium=paid&utm_campaign=error-assessors` |
| WhatsApp status | `?utm_source=whatsapp&utm_medium=status&utm_campaign=error-assessors` |
| School newsletter | `?utm_source=newsletter&utm_campaign=error-assessors` |

Rules for the labels: use lowercase, and use dashes instead of spaces.
If someone opens the page without a label, those parts are simply empty.

---

## What each lead holds

| In Supabase | In the email | What it holds |
| --- | --- | --- |
| sast_time | Time (SAST) | Date and time of the request, South African time |
| first_name | Name | Parent's first name |
| surname | Surname | Parent's surname |
| grade | Grade | The grade they picked, as a number from 4 to 10 |
| language | Language | Afrikaans or English |
| lead_magnet | Lead magnet | Always "20 Min Math Error Assessors" |
| utm_source | UTM source | Where they came from, for example facebook |
| utm_medium | UTM medium | The kind of link, for example paid |
| utm_campaign | UTM campaign | Your campaign name, for example error-assessors |
| referrer | Referrer | The website they were on before, if the browser shares it |
| page_url | Page | The exact page address they used |
| status | Status | Starts as "New". In Supabase you can change it, for example to "Contacted" or "Signed up" |

Supabase also adds `id` and `created_at` (the same time, in world time) to every row.

**Seeing leads on your phone:** the emails are the easiest. For the full list, open
[supabase.com/dashboard](https://supabase.com/dashboard) in your phone's browser, then
**Table Editor** and **error_assessor_leads**. Tap a status cell to change it.

## If something goes wrong

- **No emails:** check the spam folder, and check that you clicked **Activate Form** (Step 4).
- **No rows in Supabase:** check that the project is not paused (Step 1) and that you ran the SQL (Step 2).
- **You changed `site/index.html`:** drag the `site` folder onto Netlify again, or the live page stays the same.
- **A lead with a strange name arrives:** the public key lets anyone add rows, and the page has a hidden trap that stops most robots.
  If junk ever becomes a problem, tell your developer.
