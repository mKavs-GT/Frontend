import re

def check_balance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove strings and comments to avoid false positives
    content = re.sub(r'//.*', '', content)
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    content = re.sub(r'".*?"', '""', content)
    content = re.sub(r"'.*?'", "''", content)
    content = re.sub(r'`.*?`', '``', content, flags=re.DOTALL)
    
    braces = 0
    brackets = 0
    parens = 0
    
    for i, char in enumerate(content):
        if char == '{': braces += 1
        elif char == '}': braces -= 1
        elif char == '[': brackets += 1
        elif char == ']': brackets -= 1
        elif char == '(': parens += 1
        elif char == ')': parens -= 1
        
        if braces < 0: print(f"Extra closing brace at char {i}")
        if brackets < 0: print(f"Extra closing bracket at char {i}")
        if parens < 0: print(f"Extra closing paren at char {i}")

    print(f"Final counts - Braces: {braces}, Brackets: {brackets}, Parens: {parens}")

check_balance('src/App.jsx')
