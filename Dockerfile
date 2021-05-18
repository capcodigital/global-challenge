FROM node:12.22.1-alpine3.12

COPY . /app
WORKDIR /app

RUN yarn install
RUN npm run build
EXPOSE 443

CMD ["npm", "run", "start"]
