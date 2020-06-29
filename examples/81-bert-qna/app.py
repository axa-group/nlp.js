# Copyright (c) AXA Group Operations Spain S.A.
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import falcon
import json
import os
from transformers import AutoTokenizer
from urllib.parse import unquote
from waitress import serve
from deeppavlov import build_model, configs

class CORSComponent(object):
    def process_response(self, req, resp, resource, req_succeeded):
        resp.set_header('Access-Control-Allow-Origin', '*')
        if (req_succeeded
            and req.method == 'OPTIONS'
            and req.get_header('Access-Control-Request-Method')
        ):
            allow = resp.get_header('Allow')
            resp.delete_header('Allow')
            allow_headers = req.get_header('Access-Control-Request-Headers', default = '*')
            resp.set_headers((
                ('Access-Control-Allow-Methods', allow),
                ('Access-Control-Allow-Headers', allow_headers),
                ('Access-Control-Max-Age', '86400'),  # 24 hours
            ))

class ResourceTokenize(object):
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained('bert-large-uncased-whole-word-masking-finetuned-squad') 

    def on_post(self, req, resp):
        data = json.load(req.bounded_stream)
        text = unquote(data.get('text'))
        tokens = self.tokenizer.tokenize(text)
        result = { "tokens": tokens }
        resp.body=json.dumps(result, ensure_ascii=False)
        resp.status=falcon.HTTP_200

class ResourceQna(object):
    def __init__(self):
        self.model = build_model(configs.squad.squad_bert_multilingual_freezed_emb, download=True)

    def on_post(self, req, resp):
        data = json.load(req.bounded_stream)
        text = unquote(data.get('text'))
        query = unquote(data.get('query'))
        result = self.model([text], [query])
        resp.body=json.dumps(result, ensure_ascii=False)
        resp.status=falcon.HTTP_200

port = os.environ.get('PORT', '8000')
api = falcon.API(middleware=[CORSComponent()])
api.add_route('/tokenize', ResourceTokenize())
api.add_route('/qna', ResourceQna())

# If you don't want to start the server from code but from shell, then use
# this code snippet:
#   waitress-serve --port=8000 app:api
serve(api, host='127.0.0.1', port=port)
