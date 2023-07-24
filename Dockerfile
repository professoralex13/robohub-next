# syntax=docker/dockerfile:1

FROM node:18

WORKDIR /app

COPY src ./src
COPY prisma ./prisma
COPY public ./public
COPY types ./types
COPY package*.json next.config.js postcss.config.js tailwind.config.js tsconfig.json ./
RUN npm install --omit=dev

ENV GOOGLE_CLIENT_ID=none
ENV GOOGLE_CLIENT_SECRET=none
ENV DISCORD_CLIENT_ID=none
ENV DISCORD_CLIENT_SECRET=none
ENV GITHUB_CLIENT_ID=none
ENV GITHUB_CLIENT_SECRET=none
ENV GCLOUD_PROJECT_ID=none
ENV GCLOUD_CLIENT_EMAIL=none
ENV GCLOUD_PRIVATE_KEY=none

RUN npm run build:production

COPY . .

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:production"]
