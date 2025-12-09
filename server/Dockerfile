FROM node:18-alpine

# Install required system libs (OpenSSL 3 compatible)
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "start"]
