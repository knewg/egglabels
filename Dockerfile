FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN mkdir client
COPY client/package*.json client/


RUN yarn
RUN cd client && yarn
RUN cd ..

RUN echo "deb http://deb.debian.org/debian stretch-backports main" > /etc/apt/sources.list.d/backports.list
RUN echo "deb http://deb.debian.org/debian stretch-backports-sloppy main" >> /etc/apt/sources.list.d/backports.list
RUN apt-get update
RUN apt-get install build-essential qtbase5-dev libqt5svg5-dev qttools5-dev zlib1g-dev -y
RUN apt-get -t stretch-backports-sloppy install libarchive13 -y
RUN apt-get -t stretch-backports install cmake -y
RUN wget "https://github.com/jimevins/glabels-qt/archive/glabels-3.99-master561.tar.gz"
RUN tar xvf glabels*
RUN rm glabels*.tar.gz
RUN cd glabels*/ && mkdir build && cd build && cmake .. && make && make install
RUN apt-get install xvfb -y
ENV LANG=C.UTF-8
RUN apt-get install fonts-dejavu -y
RUN fc-cache
RUN apt-get install printer-driver-ptouch cups cups-client -y
RUN apt-get install vim -y

# Bundle app source
COPY . .
RUN chmod +x start.sh
RUN touch firstStart

ENV NODE_ENV=production 
EXPOSE 5000
CMD ./start.sh
