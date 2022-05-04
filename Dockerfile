FROM node:16-alpine

# Install the following packages in Alpine Linux
RUN apk update && apk add --no-cache fontconfig curl curl-dev && \
    cd /tmp && curl -Ls https://github.com/dustinblackman/phantomized/releases/download/2.1.1/dockerized-phantomjs.tar.gz | tar xz && \
    cp -R lib lib64 / && \
    cp -R usr/lib/x86_64-linux-gnu /usr/lib && \
    cp -R usr/share /usr/share && \
    cp -R etc/fonts /etc && \
    curl -k -Ls https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 | tar -jxf - && \
    cp phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs

#RUN apk add --update python make g++\
 #  && rm -rf /var/cache/apk/*
   
WORKDIR /app

COPY package.json .

# Install app dependencies
RUN cd /app && npm install

# Bundle app source
COPY . /app

EXPOSE 5000

CMD [ "node", "index.js"]
