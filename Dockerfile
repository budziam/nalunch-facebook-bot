FROM node:12

EXPOSE 8020

COPY . /app
WORKDIR /app

RUN yarn install --frozen-lockfile

CMD yarn start
