# Paywall-classify

A tensorflow and puppeteer based app that takes a list of URIs, maximum of 10 per request, gathers thumbnail screenshots for each of the sites and then classifies if the URI requested is a paywall or content page.

## Installation

Since this app utilizes Python 3 (tensorflow) and Nodejs 8 (puppeteer) it is recommended to build this app with Docker. To build the image:

```shell
$ docker build -t paywall-classify .
```

To run the server:

```shell
$ docker run -it --rm -p 5000:5000 paywall-classify
```

Then the server is accessible from: http://0.0.0.0:5000/.

## Data

The images used to train the image classifier are included in the Docker image build, but can also be found here: http://www.cs.odu.edu/~gatkins/public_data/paywall-training-images.tgz.
It consists of 122 `paywall_page` images and 119 `content_page` images.
