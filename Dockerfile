FROM node:22-alpine
WORKDIR /app/web
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
COPY data/curriculum.json /app/data/curriculum.json
COPY LE_Vault/01_Requirements/04_Issues_Register.md /app/LE_Vault/01_Requirements/04_Issues_Register.md
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--strictPort"]
