# 1. Use Node.js
FROM node:18-alpine

# 2. Set the working directory to the root
WORKDIR /app

# 3. Copy the package.json from your root
COPY package*.json ./
RUN npm install

# 4. Copy everything else (including your frontend folder and server.js)
COPY . .

# 5. Expose the port your server.js uses
EXPOSE 3000

# 6. Start the app
CMD ["node", "server.js"]
