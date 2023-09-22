FROM node:18
WORKDIR /home/teslim/real-time-chat-application
COPY package*.json ./
RUN yarn install
COPY . .
CMD ["yarn", "dev"]
EXPOSE 3000