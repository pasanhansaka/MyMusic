# Railway Deployment Guide for Thorn Music Backend

To host your music backend on Railway and use it with your mobile app, follow these steps:

## 1. Prepare for Deployment
Ensure your `server` folder is ready:
- The `YOUTUBE_API_KEY` must be set in Railway's environment variables (not in `.env`).
- Railway will automatically detect the `package.json` and run `npm start`.

## 2. Deploy via Railway Website (Recommended)
This is the easiest way to keep your server updated.

1.  **Push to GitHub**: Create a GitHub repository and push your `server` folder there.
2.  **Connect to Railway**:
    - Go to [railway.app](https://railway.app) and log in.
    - Click **+ New Project** > **Deploy from GitHub repo**.
    - Select your repository.
3.  **Automatic Build**: Railway will see your `Dockerfile` and build the server automatically.
4.  **Set Environment Variables**:
    - In the Railway Dashboard, go to **Variables**.
    - Add `YOUTUBE_API_KEY` (your key).
    - Add `PORT` (set it to `3000`).

## 3. Update Mobile App
Once deployed, Railway will give you a public URL like `https://server-production.up.railway.app`.
- Go to [musicApi.ts](file:///d:/PASAN/PROJECTS/REACTNATIVE/MyMusic/src/api/musicApi.ts) in the mobile project.
- Update the `API_BASE_URL` to your new Railway URL:
  ```typescript
  const API_BASE_URL = 'https://your-railway-url.up.railway.app/api';
  ```

## 4. Troubleshooting
- If `yt-dlp` is missing on Railway, you can add a **Nixpack build plan** or use the **Railway yt-dlp template**.
- Check logs in the Railway dashboard for any extraction errors.
