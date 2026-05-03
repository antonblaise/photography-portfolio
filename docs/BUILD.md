# Project Milestones

Frontend: Next.js with Tailwind CSS

Host: [Vercel](https://vercel.com)

Backend and Database: [Supabase](https://supabase.com)

Media Storage: [Cloudinary](https://cloudinary.com)

Version Control: [GitHub](https://github.com)

Language: TypeScript

GitHub project backlog: https://github.com/users/antonblaise/projects/1

## Phase 1: Environment Setup

### Remote and Local Repositories

Create GitHub repository for project.

Create Next.js project locally.

```bash
npx create-next-app@latest .
```

Use these settings:

```plaintext
√ Would you like to use the recommended Next.js defaults? » No, customize settings
√ Would you like to use TypeScript? ... Yes
√ Which linter would you like to use? » ESLint
√ Would you like to use React Compiler? ... Yes
√ Would you like to use Tailwind CSS? ... Yes
√ Would you like your code inside a `src/` directory? ... Yes
√ Would you like to use App Router? (recommended) ... Yes
√ Would you like to customize the import alias (`@/*` by default)? ... No
√ Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? ... No
```

Initialise the local git repository and link it to its remote GitHub counterpart.

Push all the changes.

Sign up for Vercel, Supabase and Cloudinary.

## Phase 2: Design Database and Link to App

Link GitHub project to Vercel and deploy it.

Upload photos to Cloudinary. Organise and sort in folders for easy browsing.

### Create Database

Create data tables on Supabase:

* cameras
  * id
  * name
  * format
* film_stocks
  * id
  * name
  * iso
* photos
  * id
  * title
  * image_url
  * camera_id
  * film_stock_id
  * is_digital
  * date
  * width
  * height

Add rows in the `camera` and `film_stocks` tables, and then the `photos` table, which relates to the previous two, to populate the database. Use photo URLs from Cloudinary.

Go to `Authentication` > `Policies`, and enable read access for all users for all 3 tables.

### Connect Supabase and Cloudinary to Vercel

* On Supabase, go to `Project Overview`, copy the `Project URL`.
* On Vercel, go to `Environment Variables`, add `NEXT_PUBLIC_SUPABASE_URL`, and paste the Supabase Project URL in.
* On Supabase, go to `Settings` > `API Keys` > `Legacy anon, service_role API keys`, copy the `anon` `public`.
* On Vercel, add another Environment Variable - `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and paste the API key in.
* On Cloudinary, go to `Home` > `Dashboard` > `Product Environment` and copy the `Cloud name`.
* On Vercel, add another Environment Variable - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, and paste the cloud name in.

For local repository, create a file named `.env.local` in the root folder, and paste these in:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=<Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<API Key>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<Cloud name>
```

Make sure `.env.local` is ignored by Git (`.gitignore`).

## Phase 3: Build APIs and Pages

Now we work on the git repository.

Install `supabase` using `npm`.

```bash
npm install @supabase/supabase-js
```

### Create Supabase Client

Create a folder in `src` named `utils `. Inside it, create a `.ts `file named `supabase.ts`.

Import 'create client' from supabase module.

Read Supabase  from `.env.local` and store them in constants.

Create a Supabase client using those environment variables, store it in another constant, and export it.

### Create Actions Hub

In `utils` folder, create another `.ts` file named `actions.ts`.

For all the actions that the webpage does, they'll be defined in this file. For example, pulling data from Supabase, filtering, sorting, viewing, searching, calculating, etc.

First, import the `supabase` client that we created. Create am object blueprint (interface) named `Photo `to specify the type of each column's data from the Supabase `photos` table. Then, create and export an asynchronous function to get photos using Supabase client into an array.

### Allow Cloudinary in Next

In `next.config.ts`, add a configuration to whitelist (allow) Cloudinary server to load our images from there into this Next app.

### Create Blank Pages

In Next.js, folders are routes.

So, since we've planned to make 3 pages - About Me, Gallery, Contact, we'll create these 3 folders:

* `app/about/page.tsx`
* `app/gallery/page.tsx`
* `app/contact/page.tsx`

Do not leave them empty, or else Vercel can't deploy the app.

Put a bare minimum placeholder code into each of them as such:

```typescript
export default function AboutPage() {
    return (
        <div>
            <h1>About Me</h1>
            <p>Coming soon. 📸</p>
        </div>
    )
}
```

Change the function's name and the header accordingly.

### The Top Nav Bar

In `src/app/layout.tsx`, create a basic top navigation bar using `Link` to include all pages (even the home page).

Study/implement these:

* what should be imported?
* name the main function as `RootLayout`, and how to pass the children into it as input argument.
* where to place the `children`, which is the placeholder for all the pages?
* what is a node?
* some basic Tailwind CSS to organise the content.
* we may use tags other than `<div>`, `<h1>` and `<p>`, such as `<main>` and `<nav>`. Why, and how are they different?

Be free to experiment and explore.

*References:*

* *https://tailwindcss.com/docs*
* *https://nerdcave.com/tailwind-cheat-sheet*

### Page 1: Gallery

We'll first work on `Gallery` page. Install `react-photo-album` with this command:

```bash
npm install react-photo-album
```

*To be continued.*
