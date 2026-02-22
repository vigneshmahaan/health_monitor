import os
import re

def remove_comments(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Could not read {filepath}: {e}")
        return

    ext = os.path.splitext(filepath)[1].lower()
    
    original_content = content
    
    if ext in ['.py']:
        content = re.sub(r'^[ \t]*#.*?\n', '', content, flags=re.MULTILINE)
    elif ext in ['.ino', '.cpp', '.h', '.c', '.js', '.jsx', '.ts', '.tsx', '.css']:
        content = re.sub(r'^[ \t]*//.*?\n', '', content, flags=re.MULTILINE)
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
        
        if ext in ['.jsx', '.tsx']:
            content = re.sub(r'\{\s*/\*.*?\*/\s*\}', '', content, flags=re.DOTALL)
            
    if content != original_content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Removed comments from {filepath}")
        except Exception as e:
            print(f"Could not write {filepath}: {e}")

if __name__ == '__main__':
    project_root = 'd:/fayas'
    exclude_dirs = {'node_modules', 'venv', '.next', '.git', '__pycache__'}
    
    for root, dirs, files in os.walk(project_root):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file.endswith(('.py', '.ino', '.cpp', '.h', '.c', '.js', '.jsx', '.ts', '.tsx', '.css')):
                remove_comments(os.path.join(root, file))
