# 20 Min Math Error Assessors: landing page with lead saving

This page lets a parent ask for free access to all our maths quizzes for one grade.
When a parent taps the button, two things happen:

1. Their details are saved as a new row in your Google Sheet.
2. WhatsApp opens with the message ready to send, just like before.

If saving ever fails, WhatsApp still opens. You never lose the chat.

## What is in this folder

| File | What it is |
| --- | --- |
| `site/index.html` | The landing page. This is the only file you upload to Netlify. |
| `apps-script/Code.gs` | The small script that puts each lead into your Google Sheet. |
| `math-error-assessors.html` | The original design draft. Leave it as it is. |

You do the setup once. It takes about 15 minutes. A computer is easiest for setup.
After that you can watch new leads arrive in the Google Sheets app on your phone.

---

## Step 1: Make the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and sign in.
2. Tap **Blank** to start a new spreadsheet.
3. Click the name at the top left ("Untitled spreadsheet") and call it **LocalTutors Leads**.

You do not need to type any headings. The script makes a tab called **Leads** with the headings for you when the first lead arrives.

## Step 2: Add the script to the Sheet

1. In the Sheet, click **Extensions** in the top menu, then **Apps Script**. A new tab opens.
2. You will see a file called `Code.gs` with a few lines in it. Select all of that text and delete it.
3. Open `apps-script/Code.gs` from this folder. Copy everything in it.
4. Paste it into the empty `Code.gs` in Apps Script.
5. Click the **Save** icon (the floppy disk), or press Ctrl+S.
6. At the top, click **Untitled project** and rename it to **LocalTutors Leads**.

## Step 3: Publish the script as a Web app

1. Click the blue **Deploy** button at the top right, then **New deployment**.
2. Next to "Select type", click the gear icon and choose **Web app**.
3. Fill it in like this:
   - **Description:** Lead capture
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**.
5. Google asks you to allow access. Click **Authorize access** and choose your Google account.
6. You may see a warning that says "Google hasn't verified this app". This is normal for your own script.
   Click **Advanced**, then **Go to LocalTutors Leads (unsafe)**, then **Allow**.
7. You now see a **Web app URL** that ends in `/exec`. Click **Copy**.

Keep this URL handy for the next step. Treat it like a private address: anyone who has it can add rows to your Sheet.

**Quick check:** paste the URL into a new browser tab. You should see
`{"ok":true,"message":"LocalTutors lead capture is running."}`.

## Step 4: Put the URL into the page

1. Open `site/index.html` in a plain text editor (Notepad on Windows, TextEdit on Mac, or VS Code).
2. Search for `PASTE_APPS_SCRIPT_URL_HERE`. It is near the top of the script, on this line:

   ```js
   const LEADS_ENDPOINT = "PASTE_APPS_SCRIPT_URL_HERE";
   ```

3. Replace only the words `PASTE_APPS_SCRIPT_URL_HERE` with your Web app URL. Keep the quote marks. It should look like this:

   ```js
   const LEADS_ENDPOINT = "https://script.google.com/macros/s/AKfy...your-id.../exec";
   ```

4. Save the file.

Until you do this, the page still works and still opens WhatsApp. It just does not save leads.

## Step 5: Put the page online with Netlify

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and sign in (or sign up for free).
2. Drag the whole **`site`** folder from your computer onto the page.
3. Wait a few seconds. Netlify gives you a web address, something like `https://random-name-123.netlify.app`.
4. Open that address and test it: fill in a name, surname, grade and language, then tap the button.
   WhatsApp should open, and a new row should appear in the **Leads** tab of your Sheet.

**To update the page later:** in Netlify, open your site, go to **Deploys**, and drag the `site` folder onto the box that says "Drag and drop your site output folder here".

**To pick a nicer name:** in Netlify go to **Site configuration**, then **Change site name**.

## Step 6: Track your Facebook ads with a UTM link

A UTM link is your normal page address with a small label on the end. The label tells you where each lead came from. It shows up in the `utm_source`, `utm_medium` and `utm_campaign` columns of your Sheet.

Take your Netlify address and add the label to the end:

```
https://your-site.netlify.app/?utm_source=facebook&utm_campaign=error-assessors
```

Use this full link as the website URL in your Facebook ad. Leads from that ad will show **facebook** and **error-assessors** in the Sheet.

Some more examples:

| Where you share it | Link ending |
| --- | --- |
| Facebook ad | `?utm_source=facebook&utm_medium=paid&utm_campaign=error-assessors` |
| Instagram ad | `?utm_source=instagram&utm_medium=paid&utm_campaign=error-assessors` |
| WhatsApp status | `?utm_source=whatsapp&utm_medium=status&utm_campaign=error-assessors` |
| School newsletter | `?utm_source=newsletter&utm_campaign=error-assessors` |

Rules for the labels: use lowercase, and use dashes instead of spaces.
If someone opens the page without a label, those columns are simply empty.

---

## What each column in the Sheet means

| Column | What it holds |
| --- | --- |
| timestamp | Date and time of the request, South African time |
| first_name | Parent's first name |
| surname | Parent's surname |
| grade | The grade they picked (Grade 4 to 10) |
| language | Afrikaans or English |
| lead_magnet | Always "20 Min Math Error Assessors" |
| utm_source | Where they came from, for example facebook |
| utm_medium | The kind of link, for example paid |
| utm_campaign | Your campaign name, for example error-assessors |
| referrer | The website they were on before, if the browser shares it |
| page_url | The exact page address they used |
| status | Starts as "New". Change it yourself, for example to "Contacted" or "Signed up" |

Tip: you can add your own columns to the **right** of `status` for notes. Do not move or rename the first 12 columns.

## If something goes wrong

- **No new rows in the Sheet:** check that the URL in `site/index.html` ends in `/exec`, that you uploaded the new `site` folder to Netlify, and that "Who has access" is set to **Anyone**.
- **You changed `Code.gs`:** changes only go live after you publish them. Click **Deploy**, then **Manage deployments**, click the pencil icon, choose **New version**, then **Deploy**. The URL stays the same.
- **You made a brand new deployment instead:** that gives you a new URL. Put the new URL into `site/index.html` and upload the `site` folder to Netlify again.
- **You see a row with a strange `'` at the start of a name:** the script adds this when a name starts with `=`, `+`, `-` or `@`, so the Sheet does not treat it as a formula. It is safe to leave.
