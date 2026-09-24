FROM node:20-alpine
WORKDIR /chain
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8545
CMD ["npm", "run", "node", "--", "--hostname", "0.0.0.0"]

