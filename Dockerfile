FROM node:16-alpine as builder

WORKDIR /app

COPY  package.json .

RUN yarn install

COPY . .

RUN yarn run build


FROM nginx

COPY --from=builder /app/dist /usr/share/nginx/html
