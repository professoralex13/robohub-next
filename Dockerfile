# syntax=docker/dockerfile:1

FROM node:18

WORKDIR /app

LABEL io.portainer.accesscontrol.teams=development

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
ENV CDN_URL=none
ENV CDN_ACCESS_KEY=none
ENV CDN_SECRET_KEY=none
ENV PUBLIC_BUCKET_NAME=none
RUN npm run build:production

COPY . .

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:production"]
