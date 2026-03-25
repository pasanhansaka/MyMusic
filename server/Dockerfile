# Use Node.js 18 on Alpine for a small image
FROM node:18-alpine

# Install dependencies for yt-dlp (Python and ffmpeg)
RUN apk add --no-cache python3 py3-pip ffmpeg curl

# Install the latest yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port (Railway uses the PORT environment variable)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
