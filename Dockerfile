FROM node:14.21.2-alpine3.16

COPY . /app
WORKDIR /app

RUN yarn install
# RUN yarn build
EXPOSE 443

CMD ["yarn", "start"]
