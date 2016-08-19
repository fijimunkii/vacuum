FROM node:5.5.0
RUN npm install pm2 -g

RUN apt update && apt install vim nano -y

RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

CMD npm i

CMD pm2 start index.js -i 1 --no-daemon

EXPOSE 5555
