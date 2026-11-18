
## Project info

**URL**: [https://udyami-project.vercel.app/]


**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. 

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

## Deploy the chatbot and fraud detector

Vercel builds the website from GitHub. The chatbot and fraud detector run as the `financial-chatbot` and `ml-fraud-detection` Edge Functions in Supabase project `bokbbzzjjiosknxwfpvb`.

1. In the [Supabase Edge Function secrets page](https://supabase.com/dashboard/project/bokbbzzjjiosknxwfpvb/functions/secrets), set `GROQ_API_KEY` to your Groq key. The function uses `openai/gpt-oss-20b` by default. Keep the key in Supabase.
2. Add a [Supabase personal access token](https://supabase.com/dashboard/account/tokens) with access to this project to [GitHub Actions secrets](https://github.com/Sangam8168/Udyami_Project/settings/secrets/actions) as `SUPABASE_ACCESS_TOKEN`.
3. Push the changes to `main`. The **Deploy chatbot and fraud detection** workflow publishes both Edge Functions when its code or configuration changes. You can also run the workflow from the GitHub Actions tab with `main` selected.
4. Once Vercel and the workflow succeed, sign in on [the deployed chatbot page](https://udyami-project.vercel.app/chatbot) and send a test message. If Google sign-in redirects to localhost, set the Supabase Auth Site URL to `https://udyami-project.vercel.app/` and add that URL to the allowed redirects.

### Test AI locally

Set `GROQ_API_KEY` in the Git-ignored `supabase/.env.local` file, then restart `npm run dev` and visit the app on localhost. The local Vite server runs both handlers using your Groq key and checks your Supabase session. The production build calls the hosted Supabase functions.
