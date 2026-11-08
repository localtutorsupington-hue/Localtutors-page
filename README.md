# 20 Min Math Error Assessors: landing page with lead saving

This page lets a parent ask for free access to all our maths quizzes for one grade.
The parent fills in their name, surname, WhatsApp number and grade, and picks Afrikaans or English.
When they tap the button, three things happen at once:

1. The lead is **emailed** to you by Netlify, the website host, with the parent's WhatsApp number as a tap-to-chat link.
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

Netlify sends the emails itself. You switch this on once in your Netlify site.
Netlify sometimes renames its menus: if you see **Project configuration** instead of **Site configuration**, it's the same place.

1. In Netlify, open your site (math-assessor).
2. Go to **Site configuration**, then **Forms**. If you see **Enable form detection**, click it.
3. Upload the `site` folder again (see "To update the page later" above). Netlify only finds the form when the page is uploaded after detection is on.
4. Go to **Site configuration**, then **Notifications**, then **Emails and webhooks**.
   Under **Form submission notifications**, click **Add notification**, then **Email notification**.
   Type localtutors.upington@gmail.com, choose the form **error-assessor-leads**, and save.
5. Send yourself a **test lead** from the live page. Within a minute you get an email with the subject "New lead: ...".
   Check the spam folder the first time, and mark it "Not spam".
6. You can also see every lead in Netlify under **Forms**. Your test lead is there, and in Supabase too. You can delete it in both.

The free Netlify plan includes 100 form leads a month. If you go over, Netlify asks you to upgrade. Supabase keeps saving every lead either way.

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
| sast_time | time_sast | Date and time of the request, South African time |
| first_name | name | Parent's first name |
| surname | surname | Parent's surname |
| whatsapp | whatsapp | Parent's WhatsApp number, like +27821234567 |
| (not saved) | whatsapp_link | Tap it to open a WhatsApp chat with the parent |
| grade | grade | The grade they picked, as a number from 4 to 10 |
| language | language | Afrikaans or English |
| lead_magnet | lead_magnet | Always "20 Min Math Error Assessors" |
| utm_source | utm_source | Where they came from, for example facebook |
| utm_medium | utm_medium | The kind of link, for example paid |
| utm_campaign | utm_campaign | Your campaign name, for example error-assessors |
| referrer | referrer | The website they were on before, if the browser shares it |
| page_url | page_url | The exact page address they used |
| status | (not sent) | Starts as "New". In Supabase you can change it, for example to "Contacted" or "Signed up" |

Supabase also adds `id` and `created_at` (the same time, in world time) to every row.
Leads from before 8 November 2026 have no number, because the form didn't ask for one yet. Their numbers are in your WhatsApp chats if they sent the message.

**Seeing leads on your phone:** the emails are the easiest. For the full list, open
[supabase.com/dashboard](https://supabase.com/dashboard) in your phone's browser, then
**Table Editor** and **error_assessor_leads**. Tap a status cell to change it.

## If something goes wrong

- **No emails:** check the spam folder. In Netlify, check that **Forms** lists **error-assessor-leads** and that the email notification is set up (Step 4).
  If Forms is empty, turn on form detection and upload the `site` folder again.
- **No rows in Supabase:** check that the project is not paused (Step 1) and that you ran the SQL (Step 2).
- **You changed `site/index.html`:** drag the `site` folder onto Netlify again, or the live page stays the same.
- **A lead with a strange name arrives:** the public key lets anyone add rows, and the page has a hidden trap that stops most robots.
  If junk ever becomes a problem, tell your developer.
