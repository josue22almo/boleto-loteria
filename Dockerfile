FROM node:lts AS npm_base

WORKDIR /app

ARG NPM_TOKEN
ARG GITHUB_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}\n@goinapp:registry=https://npm.pkg.github.com/" > ~/.npmrc

FROM npm_base AS build

COPY ./tsconfig.json /app/tsconfig.json
COPY package.json yarn.lock /app/

RUN yarn

COPY ./src /app/src

RUN yarn build:only


FROM npm_base AS dependencies

COPY package.json yarn.lock /app/

RUN yarn install --production


FROM node:14

WORKDIR /app

RUN groupadd -g 1001 goin && useradd -g goin -u 1001 goin
USER 1001:1001

EXPOSE 3000

ENTRYPOINT [ "node" ]
CMD [ "/app/dist/index.js" ]

COPY --chown=goin:goin --from=dependencies /app/node_modules /app/node_modules
COPY --chown=goin:goin --from=build /app/src /app/src
COPY --chown=goin:goin --from=build /app/dist /app/dist
