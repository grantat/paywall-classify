#!/usr/bin/env python

import subprocess
import os
import uuid
import hashlib
from urllib.parse import urlparse
from flask import Flask, jsonify, request, send_file, send_from_directory
from flask import render_template, redirect, url_for
from tf_scripts.label_image import label_image

app = Flask(__name__, static_url_path='')


@app.errorhandler(404)
def pageNotFound(e):
    return render_template('404.html'), 404


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/static/<path:filename>')
def send_static(filename):
    return send_from_directory('static', filename)


@app.route('/screenshots/<path:dirname>/<path:filename>')
def show_screenshots(dirname, filename):
    return send_from_directory('screenshots/' + dirname, filename)


def format_uri(uri):
    if not urlparse(uri).scheme:
        uri = "http://" + uri
    return uri


def take_screenshot(uri, screenshot_dir):
    """Run puppeteer in synchronous subprocess"""
    process = subprocess.Popen(
        'node njs/screenshot.js "{}" "{}"'.format(uri, screenshot_dir),
        shell=True)
    process.wait()


@app.route('/classify', methods=['POST'])
def classifyURIs():
    """
    Given a list of URIs (maximum 10) render and save thumbnails with puppeteer
    and then respond with classification labels for URI thumbnails
    """
    uri_list = request.json[0]['value']
    uri_list = uri_list.split("\r\n")
    resp = {}

    screenshot_dir = "screenshots/" + str(uuid.uuid4()) + "/"
    if not os.path.exists(screenshot_dir):
        os.makedirs(screenshot_dir)

    if len(uri_list) > 10:
        uri_list = uri_list[:10]
    for u in uri_list:
        uri_hash = hashlib.md5(u.encode()).hexdigest()
        resp.setdefault(uri_hash, {})
        resp[uri_hash].setdefault("uri", u)
        resp[uri_hash].setdefault("image", screenshot_dir + uri_hash + ".png")
        take_screenshot(format_uri(u), screenshot_dir + uri_hash)

    for filename in os.listdir(screenshot_dir):
        if filename.endswith(".png"):
            labels = label_image(screenshot_dir + filename)
            resp[filename[:-4]].update(labels)
    print(resp)
    return jsonify(resp)


if __name__ == "__main__":
    app.run(host='0.0.0.0', threaded=True)
