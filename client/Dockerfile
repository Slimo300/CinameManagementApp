FROM node:alpine

WORKDIR /app

COPY . .

# RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*
# RUN cp ./server.crt /usr/local/share/ca-certificates/server.crt
# RUN update-ca-certificates

RUN npm install --omit=dev

CMD [ "npm", "run", "dev" ]