# Supabase Auth Email Templates – Creation 2K26

These HTML templates are for **Supabase Authentication** emails (confirm signup, magic link, etc.). They mention **Creation 2K26 Intercollegiate Symposium conducted by the Department of BCA, Bishop Heber College**.

## How to use in Supabase

1. Open **Supabase Dashboard** → **Authentication** → **Email Templates**.
2. Choose the template type (e.g. **Confirm signup**, **Magic Link**).
3. Paste the contents of the corresponding HTML file into the **Message (HTML)** field.
4. Leave the Supabase variables as-is: `{{ .ConfirmationURL }}`, `{{ .Email }}`, etc. Supabase will replace them when sending.

## Files

| File | Use for |
|------|--------|
| `creation2k26-auth-email.html` | **Confirm signup** – “Verify your email” |
| `creation2k26-magic-link.html` | **Magic Link** – “Log in” (passwordless) |

## Variables used (Supabase replaces these)

- `{{ .ConfirmationURL }}` – Link to confirm email / magic link
- `{{ .Email }}` – User’s email address

You can also use: `{{ .Token }}`, `{{ .SiteURL }}`, `{{ .RedirectTo }}`, `{{ .Data }}` if you need them.

## Customization

- Edit the HTML files to change copy, colors, or layout.
- Keep **inline styles** so emails render correctly in Gmail, Outlook, etc.
- Do not remove the `{{ .ConfirmationURL }}` link; it is required for the flow to work.
