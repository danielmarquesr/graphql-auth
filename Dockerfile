FROM node:17-alpine

EXPOSE 3000

RUN mkdir /code

ADD . /code

RUN apk add yarn

RUN yarn install

WORKDIR /code

CMD ["yarn", "start"]
