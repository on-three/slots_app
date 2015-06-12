#!/usr/bin/env python
# vim: set ts=2 expandtab:
'''
Module: img.py
Desc: drive overlay with a demo json rpc call
Author: on-three
Email: oneil.john@gmail.com
DATE: 

  
'''
import argparse
#import json
#import requests
import urllib

import pyjsonrpc

PORT = 5080

def send_image_url(url):
  '''
  display given text from channel X and user Y on video stream
  '''
  if not url:
    return

  #first clean up and filter our messages
  #msg = TextOverlay.filter_messages(text)
  #log.msg('TextOverlay: {channel} niconico : {msg}'.format(channel=channel, msg=msg.encode('utf-8')))
  http_client = pyjsonrpc.HttpClient(
    'http://127.0.0.1:5080',
    #username = 'Username',
    #password = 'Password',
  )
  response = http_client.showImage(url=url)
  print 'response: ' + response

def main():

  parser = argparse.ArgumentParser(description='JSON RPC text message to server.')
  parser.add_argument('url', help='Image url to display on stream.', type=str)
  args = parser.parse_args()

  #text = args.text.decode('utf-8')
  url = args.url
  send_image_url(url)
  

if __name__ == "__main__":
  main()