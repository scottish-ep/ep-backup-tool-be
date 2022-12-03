## no build module in project

FROM node:16.15.0 as builder
WORKDIR /app
COPY ./package.json ./
RUN yarn
COPY . .

RUN apt-get update && apt-get install -y gnupg dirmngr wget
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" > /etc/apt/sources.list.d/pgdg.list
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y software-properties-common postgresql-client-13

#CMD yarn build

EXPOSE 1337


CMD yarn develop
