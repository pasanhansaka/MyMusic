# Railway Deployment Guide for Thorn Music Backend

To host your music backend on Railway and use it with your mobile app, follow these steps:

## 1. Prepare for Deployment
Ensure your `server` folder is ready:
- The `YOUTUBE_API_KEY` must be set in Railway's environment variables (not in `.env`).
- Railway will automatically detect the `package.json` and run `npm start`.

## 2. Deploy to Railway
1.  **Install Railway CLI**: `npm i -g @railway/cli`
2.  **Login**: `railway login`
3.  **Initialize**: Inside the `server` folder, run `railway init`.
4.  **Set Environment Variables**:
    - Go to your Railway project dashboard.
    - Add `YOUTUBE_API_KEY` with your actual key.
    - Add `PORT` (usually `3000`, Railway provides this).
5.  **Deploy**: `railway up`

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
