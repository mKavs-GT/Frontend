import re

def check_tags(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove comments and strings
    content = re.sub(r'//.*', '', content)
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    content = re.sub(r'".*?"', '""', content)
    content = re.sub(r"'.*?'", "''", content)
    content = re.sub(r'`.*?`', '``', content, flags=re.DOTALL)
    
    # Find all tags
    # <Tag ... > or </Tag>
    # Ignore self-closing tags <Tag ... />
    tags = re.findall(r'<(?!/)(?!script)(?!style)(?!img)(?!br)(?!hr)(?!input)(?!link)(?!meta)(?!iframe)(?!Square)(?!Play)([a-zA-Z0-9\._]+)[^>]*?(?<!/)>|</([a-zA-Z0-9\._]+)>', content)
    
    stack = []
    for open_tag, close_tag in tags:
        if open_tag:
            stack.append(open_tag)
        elif close_tag:
            if not stack:
                print(f"Extra closing tag: </{close_tag}>")
            else:
                last = stack.pop()
                if last != close_tag:
                    print(f"Mismatch: <{last}> closed by </{close_tag}>")
    
    if stack:
        print(f"Unclosed tags: {stack}")
    else:
        print("All tags balanced!")

check_tags('src/App.jsx')
