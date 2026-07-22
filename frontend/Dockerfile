FROM node@sha256:3bc9a4c4cc25cfde1e8f946341c85f333c36517aafda829b4bb7e785e9b5995c

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts && npm cache clean --force --ignore-scripts

COPY index.html ./
COPY vite.config.js ./
COPY eslint.config.js ./
COPY public ./public
COPY src ./src

RUN chown -R node:node /app

USER node

EXPOSE 5173

CMD ["npm", "run", "dev"]
