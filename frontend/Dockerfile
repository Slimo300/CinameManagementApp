FROM node:alpine as builder

WORKDIR /app

COPY . .
RUN npm install --only=prod
RUN npm ci

RUN npm run build

# CMD ["npm", "start"];

FROM nginx:1.21.0-alpine

# New Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY nginx-conf /etc/nginx

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

# Copying our env file and env script
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# apk = alpine package keeper
RUN apk add --no-cache bash

# env.sh must be executable
RUN chmod +x env.sh

CMD [ "/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]