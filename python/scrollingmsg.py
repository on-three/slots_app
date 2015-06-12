#!/usr/bin/env python
# vim: set ts=2 expandtab:
'''
Module: scrollingmsg.py
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

def send_text(msg):
  '''
  display given text from channel X and user Y on video stream
  '''
  if not msg:
    return

  #first clean up and filter our messages
  #msg = TextOverlay.filter_messages(text)
  #log.msg('TextOverlay: {channel} niconico : {msg}'.format(channel=channel, msg=msg.encode('utf-8')))
  http_client = pyjsonrpc.HttpClient(
    'http://127.0.0.1:5080',
    #username = 'Username',
    #password = 'Password',
  )
  response = http_client.ScrollingMessage(msg=msg)
  print 'response: ' + response

def main():

  parser = argparse.ArgumentParser(description='JSON RPC text message to server.')
  parser.add_argument('msg', help='Scrolling message to display on stream.', type=str)
  args = parser.parse_args()

  #text = args.text.decode('utf-8')
  msg = args.msg

  send_text(msg)

if __name__ == "__main__":
  main()