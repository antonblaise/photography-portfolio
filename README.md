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

First, import the `supabase` client that we created.

* Create an object blueprint (interface) named `Photo` to specify the type of each column's data from the Supabase `photos` table.

  ```typescript
  interface Photo {
      id: number;
      title: string | null;
      image_url: string;
      cameras: {
          name: string;
      } | null;       // Null for when data fails to load
      camera_id: number;
      film_stocks: {
          name: string;
      } | null;       // Null for when data fails to load
      film_stocks_id: number;
      is_digital: boolean;
      date: string;
      width: number;
      height: number;
  }
  ```
* Then, create and export an asynchronous function to get photos using Supabase client into an array.

  ```typescript
  export async function getPhotos(): Promise<Photo[]> {

      // Build the base query
      let query = supabase
          .from('photos')
          .select(`
              id,
              title,
              image_url,
              cameras ( name ),
              camera_id,
              film_stocks ( name ),
              film_stock_id,
              is_digital,
              date,
              width,
              height
          `)

      // Apply sorting
      query = query.order('date', { ascending: false })

      // Run the query
      const { data, error } = await query;

      if (error) {
          console.error(error);
          return [];
      }

      // Map the data onto a list of Photo type
      return (data as any) as Photo[];
  }
  ```

Homework:

* Create interfaces for film stocks and cameras.
* Create async functions to get all film stocks and all cameras respectively.
* Create another async function to get only one single photo based on the given ID. This will be used when we create the individual page for each photo clicked.
* [Advanced] `return (data as any) ...` is not a good practice. Find out why and how to fix it.

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

## Phase 6️⃣: The Gallery Filters

In this phase, there are two new implementations:

* Filter the Gallery photos by:

  * Film stock
  * Camera

Meanwhile, we'll also do some code refactoring along the way.

### Create the filters

In `Gallery` page:

* Use `useState` to create constants to store and set the filters' states.
* Create a list of filter objects with these keys:
  * `name`: The name of the filter menu to be displayed
  * `options`: The filter menu's options to be toggled
  * `state`: The list that stores the filter menu's state (which options are selected)
  * `setState`: The `useState` function that sets the state of the filter menu
* By using a list, we can easily generate multiple menus using `.map()` later.

### Create a `Filter` child component

It's a good practice to create reusable modules. Upon deep-diving and testings, I found that a filter menu component is quite a large and complicated one. So it needs to be created as a child component that's imported into the parent component - `Gallery`.

* In `src/app` folder, create a `components` folder.
* Inside it, create `Filter.tsx`.
* In the terminal, on the root directory, run `npm install @headlessui/react`.
* Open `Filter.tsx`, import `Listbox, ListboxButton, ListboxOption, ListboxOptions` from `@headlessui/react`.
* Export the default function (component) named `Filter`. It's a usual practice to name the component after its filename.
* This component should:

  * automatically generate an array of same-looking filter menus when given a list of filters.
  * be able to run the function that handles the filter menus' changes.
* In React, a component only ever takes in 1 single property (input argument). But here, clearly there are 2 inputs needed - filters and the handler function. Therefore, they must be given as an object.
* To create the input object, which is the property, we need to create a blueprint (interface) for it.

  ```typescript
  interface FilterProps {
      filters: ?;    // What's its type?
      onFilterChange: (filterName: string, newState: number[]) => void;   // A function with those input arguments, which return nothing.
  }
  ```
* So, what's the filter's type? Based on the `filters` list in `Gallery` page, we need to create another interface for `filters`. Let's name it `FilterMenu`.

  ```typescript
  interface FilterMenu {
      name: string;       // The name of the filter menu
      options: {          // The selections
          id: number;
          name: string;
      }[];
      state: number[];    // The state of the filter menu
  }
  ```
* Now, the `FilterProps` interface should look like this:

  ```typescript
  interface FilterProps {
      filters: FilterMenu[];
      onFilterChange: (filterName: string, newState: number[]) => void;   // A function with those input arguments, which return nothing.
  }
  ```

  Because `filters` is a list of objects of type `FilterMenu`.
* Now, the component function should be created like this:

  ```typescript
  export default function Filter( { filters, onFilterChange }: FilterProps ) { ... }
  ```

  We clearly specify that the property is of type `FilterProps`.
* Now, in its `return`, use `filters.map((filter) => ... )` to loop through all filters given. Inside it, we'll use `<Listbox>` to create the filter menu.

  ```typescript
  <Listbox key={filter.name} value={filter.state} onChange={(newState) => onFilterChange(filter.name, newState)} multiple>
      <ListboxButton>
          (The name of the filter menu)
      </ListboxButton>
      <ListboxOptions>
          (The options of the filter menu)
      </ListboxOptions>
  </Listbox>
  ```

  `multiple` means to enable multiple selections. Otherwise only one option can be selected at a time.
* Below `Listbox`, when the filter's state length is greater than zero, meaning when there's 1 or more options selected, show a Fragment (`<> </>`) that wraps 2 things:

  * The filter's state length, which is the number of options selected.
  * An 'X' icon to clear/reset the filter.
* Use `<div>` and Tailwind CSS to order and style them accordingly.
* Extra: Create a `Spinner` component in the  same way. We can show the spinner when something is loading, like the photo album.

### Gallery page flow

Go back to Gallery's `page.tsx`. We will now design and configure the flow of this page.

First of all, before we begin:

* Add `Suspense` and `useMemo` to the imports from 'react'.
* Import `useSearchParams` from `'next/navigation'`.
* Rename the main component from `GalleryPage` to `GalleryContent`, and do not export it.
* Then, create a new `GalleryPage` component and export it.
* In the `return` section, wrap `GalleryContent` component in `<Suspense> </Suspense>`. Because the `useSearchParams` from `'next/navigation'` **MUST exist inside Suspense**.
* Import `Filter` and `Spinner` components from `components` folder accordingly.

Now we can begin. This is the flow plan of `functionGalleryContent()`:

```plaintext
Define constants ← useState
    ↓
Define filters list
    ↓
Filter photos ← useMemo ← photos, filmStocksFilter, camerasFilter
    ↓
Set filters from URL params ← useEffect ← useSearchParams
    ↓
Set RowsPhotoAlbum specs ← useEffect
    ↓
Load data from Supabase ← useEffect
    ↓
Define function to handle filter change
    ↓
Return the UI TSX
```

* Delete the `Photo` interface, as we don't need it anymore.
* Change the type of `photos` state from `Photo[]` to `any[]`, because we just want to accept the raw photos data that's fetched by `getPhotos` of `actions.ts`, regardless of its blueprint.

  ```typescript
  const [photos, setPhotos] = useState<any[]>([]);
  ```
* Define a new constant to store `useSearchParams()`.
* Right after the `filters` list, create a constant to store the list of filtered and formatted photos, returned by `useMemo()`. Inside `useMemo()`:

  * Create a variable using `let` named `result` to store the filter result.
  * Apply film stocks and cameras filters using `.filter()` if each filter's length is greater than 0.
  * Return the result.
  * Dependencies: `photos`, `filmStocksFilter`, `camerasFilter`
* Create a `useEffect` to update the filters' states using the URL parameters.

  ```plaintext
  URL → parameters → number[] → filters
  ```

  * Create a constant named `params` to read and store the current URL parameters.

    ```typescript
    const params = new URLSearchParams(searchParams.toString());
    ```
  * Create constants of type numbers list to store the parameters of each filter.
  * Set the filters using those lists.
  * Dependency: `searchParams`
* Now, put the `RowsPhotoAlbum` specs, where we define the row height and spacing, right after the previous `useEffect`.
* Create a new `useEffect` right after it.

  * Inside this `useEffect `, put the parts starting from defining the arrow function to update row height and spacing, until the `return `statement, where we run an arrow function with `window.removeEventListener`.
  * It has no dependency.
* Now, create next `useEffect`. Here, we'll load data from Supabase and set their constants.

  * Unlike before, where we run each `action` individually, we'll now use `Promise.all()`.
  * Gather all those 3 actions - `getPhotos`, `getFilmStocks` and `getCameras`, into a list, no need to assign to any constant/variable.
  * Pass it into `Promise.all()`. In `.then()`, treat the outputs as a list of 3 variables as well.
  * Run an arrow function to set each variable - `photos`, `filmStocks` and `cameras`.
  * Set `hasMounted` as `true` right after.
  * Append a simple `.catch()` to catch the error and print an error message. Also set `hasMounted` as `true` right after it.
  * It's important to note that we must **NOT** put `setHasMounted(true)` outside of `Promise`, because this will then mean it **doesn't** wait for the async functions before setting `hasMounted` as `true`.
* Create a helper function as a constant arrow function right after the previous `useEffect`. This is the flow of the function:

  ```plaintext
  Read the given filter name and its state
      ↓
  URL → parameters → delete all
      ↓
  Filter state → append new parameters → set the filter
      ↓
  Update the browser's URL
  ```

  * Let's name it `handleFilterChange`, and the input arguments are (as they must be) exactly the same as those of `onFilterChange` of the `Filter` child component. Because this is exactly the function that we pass to it.
  * Read the parameters from the browser's current URL using `URLSearchParams` and assign it to a constant named `params`.
  * Convert the filter name to all lowercase, and replace all spaces with `_`. Assign the result into another constant. Let's name it `filterParamName`.
  * Delete `filterParamName` from `params`. This clears all the parameters of that filter, which means it is reset.
  * Then, if the given `filterState` has length greater than 0, append the filter name and state to `params`.
  * Set the state of the correct filter from the `filters` list with the `filterState`. Tip: To avoid using multiple `if-else`, use `forEach()` to help target the right filter.
  * Build the latest URL: `base URL without params + the latest params converted to string`. Then, push it as the latest entry of the browser's history stack using `window.history.pushState`.

    ```typescript
    window.history.pushState(null, '', `${window.location.pathname}?${params.toString()}`);
    ```
  * In this way, we do not refresh the page like when we use `router.push()`. Also, it's because when we use `router.push()`, the filter URL becomes unchangeable after refresh, although the filters still work. Then no matter how we change the filter, we will always return to the persistent filter URL when the page is refreshed.
  * In short:

    * use `window.history.pushState()` if you don't want refresh.
    * otherwise, use `router.push()`.
* Last but not least, in the `return` section, in `RowsPhotoAlbum `, map the `filteredPhotos` to the format that it can read, exactly as our `Photo` interface previously.

  ```typescript
  <RowsPhotoAlbum
      photos={filteredPhotos.map((p) => ({
              src: p.image_url.replace("/upload", "/upload/f_auto,q_auto,w_800"),
              width: p.width,
              height: p.height,
              alt: p.title || "photo"
          }))}
      targetRowHeight={rowHeight}
      spacing={spacing}
  />
  ```

## Phase 7️⃣: Clickable Gallery Photos

When the user clicks on a photo, it makes sense that they are shown the full version of that photo in its own individual page, along with the photo's information, namely the title, camera, film stock and date taken, which can all be fetched from our Supabase `photos` table. Each photo's page will have its own URL based on its ID.

### Create subfolder

In Next.js, the photos' page URLs can be automatically generated. Each page has a URL like this:

```plaintext
https://.../gallery/<id>
```

So, the photo's `page.tsx` is clearly located in `gallery` folder, but where and how?

It's simple in Next.js. We just need to create a folder under `gallery` that's named after variable (let's name it `photoId`) with square brackets, and put the `page.tsx` of the photo's page inside it, like this:

```plaintext
src/
└── app/
    └── gallery/
        └── [photoId]
            └── page.tsx
```

### Add click handler for `RowsPhotoAlbum`

* On top of the page, add `useRouter` beside `useSearchParams` as the imports from `next/navigation`.
* Right after the definition of `searchParams` constant, define another constant named `router` that stores `useRouter()`.
* In Gallery page's `RowsPhotoAlbum`, add `onClick` property, where we'll insert an arrow function. When a photo is clicked, the photo object is passed into the property. Then, we'll get the photo's index, generate and navigate to its URL like this:

  ```plaintext
  photo object → index → photo ID → URL → navigate
  ```
* In `RowsPhotoAlbum`, we can directly use `{ index }` to extract the index of the clicked photo.

  ```typescript
  onClick={({ index }) => {
      const clickedPhoto = filteredPhotos[index];
      router.push(`/gallery/${clickedPhoto.id}`);
  }}
  ```

### Build the photo's page

Here, the flow continues from the Gallery.

```plaintext
URL → [photoId] → params → PhotoPage component → getSinglePhoto()
```

Since we're using dynamic link (dynamic route folder) for our single photo page, in Next.js, the page's component will **always** receive an input property with these keys:

```typescript
{
    "params": "Promise { ... }",
    "searchParams": "Promise { ... }"
}
```

Where:

* `params` is a Promise containing the value of the variable stored in `[...]` of the dynamic route folder's name. In this case, it's the value of `photoId`. which is the `${clickedPhoto.id}`.
* `searchParams` is an object containing all the parameters read from the URL, exactly like how we read the filters from the URL in Gallery page. For example, from `https://.../gallery/12?param1=value1&param2=value2`, `searchParams` will be assigned a Promise this object:

  ```typescript
  {
      "param1": "value1",
      "param2": "value2"
  }
  ```

Note that both keys' values are Promises, so we definitely need to define our component as an **async function**!

First and foremost, let's define clearly the interface of the input property that we want. We do not need `searchParams` for our single-photo page here.

```typescript
interface PhotoPageProps {
    params: Promise<{ photoId: string }>;
}
```

That `photoId` **MUST** match the `[photoId]` folder name!

Then, create the component async function as such:

```typescript
export default async function PhotoPage({ params }: PhotoPageProps) {
    ...
}
```

Of course, we can skip the interface and directly set the type of `{ params }` as `any`, but it's a much better pactice to properly define the type of the property, due to:

* Type safety. We prevent runtime crashes by ensuring that we only access the keys that actually exist in `params`.
* Code readability. We clearly 'document' the exact dynamic folder parameters that this page reads and uses.
* Maintainability. If we so happen to rename `[photoId]` into something else, the compiler will flag every other files that need to be updated, rather than silently failing.

Import `getSinglePhoto` on the very top of the `page.tsx` from `actions.ts` if you haven't.

In this `PhotoPage` component:

* Read the `params` with `await` (because it's a Promise) and store it in a constant.
* Read `photoId` from the constant.
* Convert `photoId` into a `Number` and pass it into `getSinglePhoto` with `await`, as it is an async function.
* Store the output photo object into a constant.
* [Homework] In the `return` part, attach the image and its other info. Design the page properly with Tailwind CSS. Also handle the case where the photo ID is invalid, resulting in `photo = null`.
