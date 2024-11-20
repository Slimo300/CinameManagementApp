FROM node:alpine

WORKDIR /app
COPY . .
RUN npm install --omit=dev

CMD [ "npm", "run", "dev" ]