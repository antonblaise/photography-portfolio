# photography-portfolio

A website to showcase my photography and also my web dev skills. 📸🌐

# Project Milestones 🌠

## Tech Stack

Frontend: **Next.js** with **Tailwind CSS**

Host: [Vercel](https://vercel.com)

Backend and Database: [Supabase](https://supabase.com)

Media Storage: [Cloudinary](https://cloudinary.com)

Version Control: [GitHub](https://github.com)

Language: TypeScript

GitHub project backlog: https://github.com/users/antonblaise/projects/1

Image optimiser: [Squoosh.app](https://squoosh.app)

## Phase 1️⃣: Environment Setup

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

## Phase 2️⃣: Design Database and Link to App

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

## Phase 3️⃣: Build APIs and Pages

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

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`,
    },
  ],
},
```

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

*FYI: **No need** to import `globals.css` into the pages to style the page with Tailwind.*

### The Top Nav Bar and Footer

In `src/app/layout.tsx`, create a basic top navigation bar using `Link` to include all pages (even the home page).

Then, write and style a footer using the `<footer>` element such that:

* when the content is shorter than the page height, it stays at the bottom of the page.
* when the content is longer than the page height, it's always the bottommost element.

Study/implement these:

* what should be imported?
* name the main function as `RootLayout`, and how to pass the children into it as input argument.
* where to place the `children`, which is the placeholder for all the pages?
* what is a node?
* some basic Tailwind CSS to organise the content.
* we may use tags other than `<div>`, `<h1>` and `<p>`, such as `<main>` and `<nav>`. Why, and how are they different?
* how to implement hover effect (or any other customisations) across all Links?
* handle the cases for when viewed on mobile vs on desktop. Ensure nothing goes out of viewport.
* Expand the clickable region beyond just the text for better UX while not messing up the overall look.

Be free to experiment and explore.

*References:*

* *https://tailwindcss.com/docs*
* *https://nerdcave.com/tailwind-cheat-sheet*

## Phase 4️⃣: The Gallery - Display the Photos

We'll first work on `Gallery` page to display the photos. We will not implement any filter for now.

### Install Node Package

Install `react-photo-album` with this command:

```bash
npm install react-photo-album
```

### Gallery Layout Plan

We'll follow these specs in this page:

|            | Desktop | Mobile |
| ---------- | :-----: | :----: |
| Row height |  250px  | 150px |
| Spacing    |  10px  |  5px  |

Note that the row heights will not be exact. Those are approximates that `RowsPhotoAlbum` follows to create the justified layout.

### Build the Gallery

In the file `src/app/gallery/page.tsx`, this is what we'll do.

1. Specify 'use client' on top of the file.

   * We depend on the client's device viewport to decide the rows' heights and photos' spacings.
2. Import the necessary modules:

   * the `getPhotos` action that we defined.
   * `RowsPhotoAlbum ` from `react-photo-album`.
   * `react-photo-album/rows.css` for styling.
   * React: `useState` for data handling, and `useEffect` to run code section when page is loaded.
3. Go into the function named `GalleryPage` which we created before. This is called a 'component'. It renders the gallery page content.

   * Clear all of its old content. We're going to build it for real now.
   * Use `useState` to define these constants and functions to assign them data.
     * `hasMounted` (boolean flag to check and signal if the page has already mounted)
     * photos (array of type Photo)
     * row height (number)
     * spacing (number)
   * Build a `useEffect` section
     * Load raw photos using `getPhotos` and store into a variable that acts as the input of `.then()`.
       * Use `.map` to map each photo object from the variable into a new constant in the format acceptable by `RowsPhotoAlbum`
         * Supabase `image_url` → `src`
         * Supabase `width` → `width`
         * Supabase `height ` → `height`
         * Supabase `title` → `alt`
       * Pass the contant into the `useState` function that sets the main `photos` constant.
       * Set `hasMounted` to `true` to signal that all photos have indeed been loaded.
     * Build an arrow function (stored in a constant) to calculate the row height and spacing using `window.innerWidth`.
       * If greater than **768px**, then it's considered medium (desktop). Otherwise, it's mobile.
       * Store the results with the `useState` functions of constants 'row height' and 'spacing' respectively.
     * Call the function once.
     * Add window event listener to listen for `resize` and trigger the function.
     * At the end of this  `useEffect`, return an arrow function to remove the event listener, which will be run upon component unmount.
   * Now, in the `return` section of this function:
     * Show the page title. Feel free to style and design it as you like.
     * Open an expression using curly braces `{}`. Inside the expression, use a ternary operator to decide what to render when  `hasMounted `is `true `and is `false`.
     * When `false`: show a Tailwind spinner to indicate the loading state.
     * When `true`: Insert a `RowsPhotoAlbum `element by passing the `photos `constant into it, and also the 'row height' and 'spacing' into `targetRowHeight `and `spacing` respectively.
   * Finally - Optimisations
     * Loading the gallery faster
       * Initially, all the photos in the gallery are in full size.
       * We can make use of Cloudinary to optimise the size of each photo by modifying its URL.
       * `getPhotos()` → `.then()` → `.map()` : For key `src`, which is the URL, replace the string `/upload` with `/upload/f_auto,q_auto,w_800`.
         * `f_auto`: Automatically pick a format (e.g. webp, avif)
         * `q_auto`: Automatically set the quality with compression
         * `w_800`: Maximum 800px wide each image. Doesn't affect aspect ratio.
       * As a result, each photo on Gallery is around 100 or less kB.

## Phase 5️⃣: The Home and Contact Page

### Ideation

Here's the idea for the Home page design:

* Two sides, left and right. (Desktop view)
* Left side:
  * My name "Antonius" in large font.
  * Film photography slogan - "Advance, Compose, Shutter, Repeat" in small font, shown in lines.
  * Everything is aligned to the right.
* Right side:
  * A 2x3 grid.
  * Preview of 1 photo for each film stock, 5 in total.
  * The 6th cell is a wording - "And more."
  * Every photo shown has fixed 2:3 aspect ratio, cropped and centered.

As for the Contact page, I'll make it simple. Just ordered grids of buttons.

* GitHub
* Instagram
* LinkedIn
* Email
* YouTube
* Facebook

### Implementation

Browse and get awesome fonts here: https://fonts.google.com

**Home** page -  `app/page.tsx`

* Store Cloudinary photos URL prefix into a constant. Use `f_auto,q_auto` to optimise the page's loading.
* Make a constant to store the slogan. Since I want to show them in lines, I use a list.
* Make another list constant to store the specifications of the grids on the right side, namely the image source URL and its wording.
* Use Flexbox in the `<main>` section and use it to order the elements in columns.
* Create 2 `<div>`, which becomes the left and right columns of the Flexbox.
* Implement and design the left side as specified in the idea. For the slogan, use `.map()` to gracefully loop through and display each line.
* For the right side, also use `.map()` to loop through each preview item, including the "And more.". Use ternary operator to help in styling either the photo or the wording.
* Feel free to play around and tweak the Tailwind CSS stylings as needed. Don't forget to consider both mobile and desktop use cases.

**Contact** page - `app/contact/page.tsx`

Browse icons here: https://www.flaticon.com/icon-fonts-most-downloaded

* Import Flaticon brands and regular-rounded and  into `globals.css`.

  ```css
  @import url('https://cdn-uicons.flaticon.com/4.0.0/uicons-brands/css/uicons-brands.css');
  @import url('https://cdn-uicons.flaticon.com/4.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css');
  ```

  On Flaticon, click the `CDN` of the icon to copy the import link.
* Create a constant list to store each link's icon and URL.
* Use `.map()` to loop through each one to create links `<a>` using the icons and URLs.
* Use `<i>` to display the icons in its `className`. This element is wrapped inside the `<a>` element.
* Tips:

  * `target="_blank"` - Open in new tab.
  * `rel="noopener noreferrer"` - Security feature.
    * `noopener`: prevents the new page from accessing `window.opener` of the original page, blocking potential malicious control of the opener page.
    * `noreferrer`: also prevents sending the referrer URL to the new page and usually implies `noopener` in modern browsers.
  * For Email, use this as link: `mailto:youremail@example.com`.
  * Use padding to expand clickable area.
* Position all icons in the center of the page. Space and size them accordingly for the minimalistic look.
* Use Tailwind CSS to further style and position them as you like.

## Phase 6: The Gallery Filters

In this phase, there are two new implementations:

* Filter the Gallery photos by:

  * Film stock
  * Camera

### Implementation

Step 1 - Modify the `getPhotos()` function in `utils/actions.ts` and test with arbiterary values in `gallery/page.tsx`.

* Introduce input arguments/parameters:
  * film stock IDs (number)
  * camera IDs (number)
* Do not execute the query immediately now. Instead, store it in a mutable variable first.
* Then, for each filter, append the query with `in()` to only select the rows with columns that match the filters.

Step 2 - Still in `utils/actions.ts`, create functions and interfaces

* Create functions to get film stocks and cameras data from Supabase.
* Create interfaces for `film stock` and `camera` respectively, just like `photo`.

Step 3 - `app/gallery/page.tsx`

* Import the new functions created in `actions.ts` into this file.
* Then, create interfaces for `film stock` and `camera`, but they don't need to be formatted like `photo`.
* Use `useState` to store film stocks and cameras data into constants.
* Also, use `useState` to store their filters into constants.
* In `useEffect()`:
  * Set mount state as `false` at the very beginning, and `true` at the very end.
  * Query Supabase using the functions from `actions.ts` and use their `useState` functions to store them.
  * `useEffect` depends on film stocks filter and cameras filter. Which means, the page re-renders as long as they are changed.
* Create function for the filters' checkboxes `<input>` to run when toggled.
  * If the toggled item was checked, remove it from the checked list.
  * Otherwise, add it into the checked list.
* Install `@headlessui/react`, study it and use its `Listbox` to build the filters.
* Add a button to reset each filter.
