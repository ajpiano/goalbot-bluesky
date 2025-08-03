# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.11.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="SvelteKit"

WORKDIR /app

ENV NODE_ENV="production"

FROM base as build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Clear npm cache and install dependencies
COPY package.json ./
RUN npm cache clean --force && \
    npm install

COPY . .

RUN npm run build

FROM base

COPY --from=build /app /app

EXPOSE 3600
CMD [ "node", "build" ]