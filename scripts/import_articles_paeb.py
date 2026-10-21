#!/usr/bin/env python3
from pathlib import Path
import json, zipfile, shutil, xml.etree.ElementTree as ET
from urllib.parse import urlsplit, urlunsplit
from html import escape
root=Path(__file__).resolve().parents[1]
archive=root/"incoming"/"paeb-tous-articles-site-ready.zip"
if not archive.exists(): raise SystemExit("Archive absente")
tmp=root/".paeb-import"
if tmp.exists():shutil.rmtree(tmp)
tmp.mkdir()
with zipfile.ZipFile(archive) as z:
  for name in z.namelist():
    p=Path(name)
    if p.is_absolute() or ".." in p.parts: raise SystemExit("Chemin ZIP non autorisé")
  z.extractall(tmp)
pack=tmp
if not (pack/"article_manifest.json").exists():
  candidates=list(pack.rglob("article_manifest.json"))
  if len(candidates)!=1:raise SystemExit("Manifest absent ou ambigu")
  pack=candidates[0].parent
articles=pack/"articles"
manifest=json.loads((pack/"article_manifest.json").read_text(encoding="utf-8"))
if not articles.is_dir():raise SystemExit("Dossier articles absent")
target=root/"articles"
target.mkdir(exist_ok=True)
for item in manifest:
  slug=item["slug"]
  if not slug.replace("-","").isalnum():raise SystemExit("Slug non sûr")
  source=articles/(slug+".html")
  if not source.exists():raise SystemExit("Article manquant: "+slug)
  html=source.read_text(encoding="utf-8").replace('href="/assets/favicon.svg" type="image/svg+xml"','href="/assets/favicon.png" type="image/png"')
  (target/source.name).write_text(html,encoding="utf-8")
index_html=(articles/"index.html").read_text(encoding="utf-8").replace('href="/assets/favicon.svg" type="image/svg+xml"','href="/assets/favicon.png" type="image/png"')
(target/"index.html").write_text(index_html,encoding="utf-8")
news=root/"actualites.html"
html=news.read_text(encoding="utf-8")
marker='id="articles-officiels-paeb"'
if marker not in html:
  cards="".join('<article class="panel" style="padding:20px"><h3><a href="/articles/'+escape(item["slug"])+'">'+escape(item["title"])+'</a></h3><p>'+escape(item["description"])+'</p></article>' for item in manifest)
  block='<section id="articles-officiels-paeb" class="container" style="padding:40px 0 65px"><h2>Articles et dossiers du PAEB</h2><p>Découvrez les publications et ressources du Projet d’Appui à l’Entrepreneuriat au Bénin.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px">'+cards+'</div><p><a href="/articles/">Tous les articles</a></p></section>'
  if "</main>" not in html:raise SystemExit("Balise main manquante")
  news.write_text(html.replace("</main>",block+"</main>"),encoding="utf-8")
ns="http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("",ns)
p=root/"sitemap.xml"
tree=ET.parse(p);element=tree.getroot()
def canonical_url(url):
  parts=urlsplit(url)
  if parts.netloc!="paeb.bj":return url
  path=parts.path
  if path.endswith("/index.html"):path=path[:-10]
  elif path.endswith(".html"):path=path[:-5]
  if path=="/articles":path+="/"
  return urlunsplit((parts.scheme,parts.netloc,path,parts.query,parts.fragment))
urls=set()
for entry in list(element):
  loc=entry.find("{"+ns+"}loc")
  if loc is None or not loc.text:continue
  loc.text=canonical_url(loc.text)
  if loc.text in urls:element.remove(entry)
  else:urls.add(loc.text)
for url in ["https://paeb.bj/articles/"]+["https://paeb.bj/articles/"+item["slug"] for item in manifest]:
  if url not in urls:ET.SubElement(ET.SubElement(element,"{"+ns+"}url"),"{"+ns+"}loc").text=url
tree.write(p,encoding="utf-8",xml_declaration=True)
shutil.rmtree(tmp)
print("Articles intégrés :",len(manifest))
