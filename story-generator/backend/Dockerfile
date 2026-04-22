FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN chmod +x entrypoint.sh
CMD ["sh", "entrypoint.sh"]
