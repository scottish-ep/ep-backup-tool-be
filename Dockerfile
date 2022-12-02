## no build module in project
FROM node:16.15.0 as builder
WORKDIR /app
COPY ./package.json ./
RUN yarn
COPY . .

#CMD yarn build

EXPOSE 1337


CMD yarn develop
