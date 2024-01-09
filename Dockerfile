FROM node:21-alpine3.18
ENV NODE_ENV=production
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install --omit=dev
# If you are building your code for production
# RUN npm ci --omit=dev
COPY . .
CMD [ "npmx", "ts-node", "/index.ts" ]