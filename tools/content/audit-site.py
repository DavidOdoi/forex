#!/usr/bin/env python3
"""Audit sitemap pages, crawlable links, orphan URLs and indexing metadata.

Uses only the Python standard library; no analytics or private credentials.
"""
import argparse
from urllib.request import Request,urlopen
from urllib.parse import urlsplit,urlunsplit,urljoin,parse_qsl,urlencode
from xml.etree import ElementTree as ET
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from collections import Counter
import json,re,time
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--origin',default='https://www.devinforex.com')
parser.add_argument('--output',required=True)
args=parser.parse_args()
ROOT=args.origin.rstrip('/');OUT=Path(args.output);OUT.mkdir(parents=True,exist_ok=True)
OWN={'www.devinforex.com','devinforex.com','devinforex-five.vercel.app',urlsplit(ROOT).hostname}
def key(u):
 p=urlsplit(u)
 if p.hostname not in OWN:return None
 path=p.path.rstrip('/') or '/'
 if re.search(r'\.(?:png|jpe?g|webp|gif|svg|ico|pdf|css|js|woff2?)$',path,re.I) or path.startswith('/api/') or path.endswith('/data'):return None
 q=urlencode([(k,v) for k,v in parse_qsl(p.query) if k=='country' and v!='Global'])
 return ROOT+path+('?' +q if q else '')
def fetch(url):
 with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'}),timeout=18) as r:return r.status,r.url,dict(r.headers),r.read().decode('utf-8','replace')
class Page(HTMLParser):
 def __init__(self,url):super().__init__();self.url=url;self.skip=0;self.main=0;self.nav=0;self.title=0;self.titletext=[];self.text=[];self.links=[];self.headings=[];self.active=[];self.ids=[];self.canon=[];self.meta={};self.images=[]
 def handle_starttag(self,t,a):
  a=dict(a)
  if t in ('script','style'):self.skip+=1
  if t=='main':self.main+=1
  if t in ('nav','footer'):self.nav+=1
  if t=='title':self.title+=1
  if a.get('id'):self.ids.append(a['id'])
  if t=='link' and a.get('rel')=='canonical':self.canon.append(a.get('href'))
  if t=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
  if t=='img' and self.main:self.images.append({k:a.get(k) for k in ('src','alt','width','height')})
  if t=='a' and a.get('href'):
   self.active.append({'href':urljoin(self.url,a['href']),'text':[],'in_main':bool(self.main),'in_navigation':bool(self.nav),'rel':a.get('rel','')})
  if t in ('h1','h2','h3') and self.main:self.headings.append({'level':t,'text':''});self._heading=t
 def handle_endtag(self,t):
  if t in ('script','style'):self.skip=max(0,self.skip-1)
  if t=='main':self.main=max(0,self.main-1)
  if t in ('nav','footer'):self.nav=max(0,self.nav-1)
  if t=='title':self.title=max(0,self.title-1)
  if t=='a' and self.active:
   a=self.active.pop();a['text']=' '.join(a['text']);self.links.append(a)
  if t in ('h1','h2','h3'):self._heading=None
 def handle_data(self,d):
  if self.skip or not d.strip():return
  d=d.strip()
  if self.title:self.titletext.append(d)
  if self.main:self.text.append(d)
  if getattr(self,'_heading',None):self.headings[-1]['text']+=' '+d
  for a in self.active:a['text'].append(d)
def page(u):
 try:
  status,final,headers,html=fetch(u);p=Page(u);p.feed(html)
  return {'url':u,'status':status,'final_url':final,'canonical':p.canon,'title':' '.join(p.titletext),'meta':p.meta,'headings':p.headings,'text':'\n'.join(p.text),'links':p.links,'ids':p.ids,'images':p.images,'response_robots':next((v for k,v in headers.items() if k.lower()=='x-robots-tag'),'')}
 except Exception as e:return {'url':u,'error':str(e)}
_,_,_,xml=fetch(ROOT+'/sitemap.xml');urls=[e.text for e in ET.fromstring(xml).findall('{*}url/{*}loc')]
with ThreadPoolExecutor(max_workers=6) as ex:pages=list(ex.map(page,urls))
OUT.joinpath('pages.json').write_text(json.dumps(pages,indent=2))
nodes={key(p['url']):p for p in pages if 'error' not in p};incoming={u:set() for u in nodes};contextual={u:set() for u in nodes};edges={u:set() for u in nodes};extra=set();externals={};badanchors=[]
for u,p in nodes.items():
 for a in p['links']:
  v=key(a['href'])
  if v:
   if v in nodes and v!=u:
    incoming[v].add(u);edges[u].add(v)
    if a['in_main'] and not a['in_navigation']:contextual[v].add(u)
   elif v not in nodes:extra.add(v)
   if v==u and (anchor:=urlsplit(a['href']).fragment) and anchor not in p['ids']:badanchors.append({'page':u,'anchor':anchor,'text':a['text']})
  elif urlsplit(a['href']).scheme in ('https','http') and urlsplit(a['href']).hostname not in OWN:
   externals.setdefault(a['href'].split('#')[0],[]).append({'page':u,'anchor':a['text']})
seen=set();todo=[ROOT+'/']
while todo:
 u=todo.pop()
 if u in seen:continue
 seen.add(u);todo.extend(edges.get(u,set())-seen)
with ThreadPoolExecutor(max_workers=6) as ex:extra_pages=list(ex.map(page,sorted(extra)))
summary={'pages':len(pages),'fetch_errors':[p for p in pages if 'error' in p],'orphan_pages':[u for u,v in incoming.items() if not v and u!=ROOT+'/'],'unreachable_from_home':sorted(set(nodes)-seen),'navigation_only':[u for u,v in contextual.items() if not v and u!=ROOT+'/'],'broken_internal':[{'url':p['url'],'error':p['error']} for p in extra_pages if 'error' in p],'extra_internal_urls':len(extra),'bad_anchors':badanchors,'external_urls':len(externals),'duplicate_titles':[{'title':t,'count':n} for t,n in Counter(p.get('title','') for p in pages).items() if n>1]}
summary['non_indexable']=[p['url'] for p in pages if re.search(r'noindex|none',p.get('meta',{}).get('robots','')+' '+p.get('response_robots',''),re.I)]
summary['canonical_mismatches']=[p['url'] for p in pages if 'error' not in p and (len(p['canonical'])!=1 or key(p['canonical'][0])!=key(p['url']))]
summary['invalid_h1_counts']=[{'url':p['url'],'count':sum(h['level']=='h1' for h in p['headings'])} for p in pages if 'error' not in p and sum(h['level']=='h1' for h in p['headings'])!=1]
OUT.joinpath('graph.json').write_text(json.dumps({u:{'incoming':sorted(incoming[u]),'contextual':sorted(contextual[u]),'outgoing':sorted(edges[u])} for u in nodes},indent=2));OUT.joinpath('summary.json').write_text(json.dumps(summary,indent=2));OUT.joinpath('external-urls.json').write_text(json.dumps(externals,indent=2));OUT.joinpath('extra-pages.json').write_text(json.dumps(extra_pages,indent=2));print(json.dumps(summary,indent=2))
