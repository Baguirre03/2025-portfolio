This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase Setup

This project uses Supabase for both database storage and file storage. Images are uploaded directly to Supabase Storage and metadata is saved to the database.

### 1. Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in your Supabase project dashboard under Settings > API.

### 2. Database Table

Your database should have a table called `portfolio_images` with these columns:

- `id` (uuid) - Primary key
- `title` (text) - Image title
- `description` (text) - Image description
- `cloudinary_public_id` (text) - File path in Supabase Storage
- `cloudinary_url` (text) - Public URL from Supabase Storage
- `is_public` (bool) - Whether image is public
- `display_order` (int4) - Display order
- `created_at` (timestamptz) - Creation timestamp

### 3. Set up Storage Bucket

1. In your Supabase dashboard, go to Storage
2. Create a new bucket called `photos`
3. Set it to public so images can be accessed directly
4. Configure any additional bucket policies as needed

### 4. API Usage

The API endpoints are ready to use:

- **GET** `/api/photos` - Get all public images
- **GET** `/api/photos?all=true` - Get all images (including private)
- **POST** `/api/photos` - Upload image and save to database
- **GET** `/api/photos/[id]` - Get specific image
- **PUT** `/api/photos/[id]` - Update image metadata
- **DELETE** `/api/photos/[id]` - Delete image from storage and database

**POST form data fields:**

- `image` (required) - Image file to upload
- `title` (required) - Image title
- `description` (optional) - Image description
- `isPublic` (optional) - Boolean, defaults to true
- `displayOrder` (optional) - Integer, defaults to 0

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

This is a standard Next.js application that can be deployed on any platform that supports Next.js:

- **Vercel** (recommended) - Connect your repository and deploy automatically

For the easiest setup, use **Vercel** - just connect your repository and it will build and deploy automatically.
