FROM ubuntu:latest
LABEL maintainer="Grant Atkins <gatki001@odu.edu>"

# Install python3
RUN apt-get update \
  && apt-get install -y python3-pip python3-dev curl \
  && cd /usr/local/bin \
  && ln -s /usr/bin/python3 python \
  && pip3 install --upgrade pip

# Download training images and mkdir for output images
RUN mkdir /usr/src/app \
  && cd /usr/src/app/ \
  && mkdir tf_files/ \
  && mkdir screenshots/
WORKDIR /usr/src/app
RUN curl http://www.cs.odu.edu/~gatkins/public_data/paywall-training-images.tgz \
  | tar xz -C tf_files/

# Install pip requirements and train classifier
COPY requirements.txt /usr/src/app/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /usr/src/app
RUN chmod a+x train.sh \
    && ./train.sh

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash && \
    apt-get install -y nodejs build-essential

# Install chrome
RUN apt-get update && apt-get install -yq libgconf-2-4
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

# Install Node packages
RUN npm install

# Start server
CMD ["python", "./app.py"]
