FROM ubuntu:14.04

# Environment configuration
ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 4.1.2
ENV HERMET_DIR /home/hermet/app

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Run update & install dependencies
RUN apt-get update
RUN apt-get install -y -q --no-install-recommends \
    apt-transport-https \
    build-essential \
    ca-certificates \
    curl \
    git \
    sudo \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get -y autoclean

# Install Node.js
# Create node user
RUN groupadd --gid 1000 node \
  && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

# gpg keys listed at https://github.com/nodejs/node
RUN set -ex \
  && for key in \
    9554F04D7259F04124DE6B476D5A82AC7E37093B \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    B9AE9905FFD7803F25714661B63B535A4C206CA9 \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
  ; do \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key"; \
  done


RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-x64.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Install PM2
RUN npm i -g pm2

# Create hermet user
RUN useradd --user-group --create-home --shell /bin/false hermet;
USER hermet

# Create app directory
RUN mkdir -p ${HERMET_DIR}
WORKDIR ${HERMET_DIR}

# Install node dependencies
COPY package.json ${HERMET_DIR}
RUN npm install

# Copy project files
COPY . ${HERMET_DIR}

# Run gulp
RUN node_modules/.bin/gulp build

# Run hermet
CMD ["pm2", "start", "pm2.json", "--no-daemon"]