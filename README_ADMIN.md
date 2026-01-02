# Admin Panel Setup Guide

## NeonDB Database Setup

### 1. Create a Neon Database

1. Go to [https://neon.tech](https://neon.tech) and sign up/login
2. Create a new project
3. Copy your connection string from the Neon Console

### 2. Configure Environment Variables

**Option 1: Using the setup script (Recommended)**
```bash
./setup-env.sh
```
Then edit `.env.local` and add your actual credentials.

**Option 2: Manual setup**
1. Copy the template file:
   ```bash
   cp env.template .env.local
   ```
2. Edit `.env.local` and replace placeholder values with your actual credentials:

```env
DATABASE_URL=postgresql://username:password@hostname.neon.tech/database?sslmode=require

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Cloudinary Setup (for Image Storage)

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com) and sign up/login
2. Navigate to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret

### 2. Add Cloudinary Credentials

Add the following to your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Image Upload Features

- **Automatic Optimization**: Images are automatically optimized and resized (max 1200x800)
- **Cloud Storage**: Images are stored in Cloudinary's cloud storage
- **CDN Delivery**: Images are delivered via Cloudinary's CDN for fast loading
- **Folder Organization**: Images are organized in the `amritam-blogs` folder

### 3. Initialize Database Schema

Run the initialization endpoint to create the blogs table:

```bash
# In development
curl http://localhost:3000/api/blogs/init

# Or visit in browser
http://localhost:3000/api/blogs/init
```

### 4. Access Admin Panel

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `/admin`
3. Login with password: `admin123`

### 5. Manage Blogs

- **Add Blog**: Click "Add New Blog" button
- **Edit Blog**: Click "Edit" on any blog card
- **Delete Blog**: Click "Delete" on any blog card (with confirmation)

## Database Schema

The blogs table includes:
- `id` - Unique identifier
- `title` - Full blog title
- `title_part1` - First part of title (for display)
- `title_part2` - Second part of title (for display)
- `category` - Blog category
- `read_time` - Estimated reading time
- `description` - Short description
- `image` - Cloudinary image URL
- `pdf_path` - PDF file path (optional)
- `color` - Color theme (blue, pink, or green)
- `content` - Full blog content (HTML supported)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Security Notes

- Change the admin password in production
- Use environment variables for sensitive data
- Consider implementing proper authentication (JWT, OAuth, etc.)
- Add rate limiting to API routes
- Implement CSRF protection

