FROM node
WORKDIR /usr/src/app
# to copy files from local system to docker image
COPY package*.json ./
RUN npm install --global expo-cli
RUN npm install
COPY . .
EXPOSE 19002 19001 19000 19006
CMD ["npm", "start"] 
# to run a command when an image is run as a container