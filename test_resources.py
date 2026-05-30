import urllib.request
from html.parser import HTMLParser
from urllib.parse import urljoin

class ResourceParser(HTMLParser):
    def __init__(self, base_url):
        super().__init__()
        self.base_url = base_url
        self.resources = []
        self.base_tag_href = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'base' and 'href' in attrs:
            self.base_tag_href = attrs['href']
        
        url = None
        if tag == 'link' and 'stylesheet' in attrs.get('rel', ''):
            url = attrs.get('href')
        elif tag == 'script' and 'src' in attrs:
            url = attrs.get('src')
        elif tag == 'img' and 'src' in attrs:
            url = attrs.get('src')
            
        if url:
            self.resources.append(url)

def test_page(page_url):
    print(f"\n--- Testing {page_url} ---")
    req = urllib.request.Request(page_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8')
    except Exception as e:
        print(f"Failed to fetch {page_url}: {e}")
        return

    parser = ResourceParser(page_url)
    parser.feed(html)
    
    base = parser.base_tag_href
    print(f"Base tag found: {base}")
    
    base_url = urljoin(page_url, base) if base else page_url
    print(f"Resolved base URL for relative paths: {base_url}")
    
    for res in parser.resources:
        if res.startswith('http'):
            full_url = res
        else:
            full_url = urljoin(base_url, res)
            
        try:
            req_res = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'}, method='HEAD')
            res_response = urllib.request.urlopen(req_res)
            print(f"[OK] {res_response.status} {full_url}")
        except Exception as e:
            print(f"[ERROR] {e} -> {full_url}")

test_page('https://dev.mkavs.com/Pricing')
test_page('https://dev.mkavs.com/Branding')
test_page('https://dev.mkavs.com/Support')
