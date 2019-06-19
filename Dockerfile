FROM node:12

EXPOSE 8020

# Credentials
ARG SSH_PRIVATE_KEY
RUN mkdir /root/.ssh
RUN echo "${SSH_PRIVATE_KEY}" | base64 -d > /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

COPY . /app
WORKDIR /app

RUN yarn install --frozen-lockfile

CMD yarn start
