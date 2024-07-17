import re
from difflib import ndiff

def replace_apostrophes(text):
    # Replace all instances of ´any string´ with ‘any string’
    return re.sub(r'´(.*?)´', r'‘\1’', text)

def ensure_space_after_period(text):
    # Add a space after a period if there isn't one
    return re.sub(r'\.([^\s])', r'. \1', text)

def preprocess_text(text):
    # Replace apostrophes
    text = replace_apostrophes(text)
    
    # Ensure space after period
    text = ensure_space_after_period(text)
    
    # Remove all empty lines
    lines = text.split('\n')
    lines = [line.strip() for line in lines if line.strip()]

    # Create a break line after any end dot, and handle lines not ending with a dot
    processed_lines = []
    for line in lines:
        if line.endswith('.'):
            processed_lines.append(line)
        else:
            if processed_lines:
                processed_lines[-1] += ' ' + line
            else:
                processed_lines.append(line)
    
    # Remove 2 or more white spaces
    processed_text = ' '.join(processed_lines)
    processed_text = ' '.join(processed_text.split())
    
    # Add a break line after any end dot
    processed_text = processed_text.replace('. ', '.\n')
    
    return processed_text

# Read and preprocess both files
with open('new_text.txt', 'r', encoding='utf-8') as file1, open('old_text.txt', 'r', encoding='utf-8') as file2:
    new_text = preprocess_text(file1.read())
    old_text = preprocess_text(file2.read())

# Write the preprocessed texts back to files for verification
with open('new_text_processed.txt', 'w', encoding='utf-8') as file1, open('old_text_processed.txt', 'w', encoding='utf-8') as file2:
    file1.write(new_text)
    file2.write(old_text)

# Split the preprocessed text into lines for comparison
new_text_lines = new_text.split('\n')
old_text_lines = old_text.split('\n')

# Compare the lines of the two files
diff = list(ndiff(old_text_lines, new_text_lines))  # Compare old_text.txt (old doc) with new_text.txt (new doc)

# Write the differences to a diff file
with open('differences.txt', 'w', encoding='utf-8') as diff_file:
    for line in diff:
        diff_file.write(line + '\n')

print("Preprocessing and comparison complete. Check 'new_text_processed.txt', 'old_text_processed.txt', and 'differences.txt' for results.")
