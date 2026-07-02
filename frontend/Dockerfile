FROM node:20.19.3-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY index.html ./
COPY vite.config.js ./
COPY eslint.config.js ./
COPY public ./public
COPY src ./src

RUN chown -R node:node /app

USER node

EXPOSE 5173

CMD ["npm", "run", "dev"]
