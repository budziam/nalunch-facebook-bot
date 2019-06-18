FROM node:12

EXPOSE 9000

COPY . /app
WORKDIR /app

RUN yarn install --frozen-lockfile

CMD yarn start
