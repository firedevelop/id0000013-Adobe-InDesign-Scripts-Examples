from difflib import ndiff

# Function to preprocess the text as described
def preprocess_text(text):
    # Remove all break lines and extra white spaces
    text = ' '.join(text.split())
    # Add a break line after any end dot
    text = text.replace('. ', '.\n')
    return text

# Load the content of the two files
file1_path = 'old_text.txt'
file2_path = 'new_text.txt'

with open(file1_path, 'r', encoding='utf-8') as file1, open(file2_path, 'r', encoding='utf-8') as file2:
    file1_text = preprocess_text(file1.read())
    file2_text = preprocess_text(file2.read())

# Split the preprocessed text into lines
file1_lines = file1_text.split('\n')
file2_lines = file2_text.split('\n')

# Function to find and highlight differences
def find_and_highlight_differences(line1, line2):
    words1 = line1.split()
    words2 = line2.split()
    highlighted_words = []
    
    # Compare words and identify differences
    for word1, word2 in zip(words1, words2):
        if word1 != word2:
            highlighted_words.append(f"[***{word1}***] [***{word2}***]")
        else:
            highlighted_words.append(word1)
    
    return ' '.join(highlighted_words)

# Format differences for clearer output with instructions and visual isolation
output_lines = []
diff_number = 1

for line1, line2 in zip(file1_lines, file2_lines):
    if line1 != line2:
        output_lines.append("")
        output_lines.append(f"___________ DIFF NUMBER {diff_number} ___________")
        output_lines.append("- REMOVE")
        output_lines.append(line1)
        output_lines.append("")
        output_lines.append("+ ADD")
        output_lines.append(line2)
        output_lines.append("")
        output_lines.append("+- CHANGES")
        output_lines.append(find_and_highlight_differences(line1, line2))
        output_lines.append("")  # blank line for separation
        diff_number += 1

# Add footer for clarity
footer = "\nPlease review and update new_text.txt accordingly."

# Write differences to a text file
output_file = 'differences.txt'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines))
    f.write(footer)

print(f"Differences written to {output_file}")

# Generate HTML
import subprocess

# Add this line to call and execute generate_html.py
subprocess.run(["python3", "generate_html.py"])

# open index.html
# import webbrowser
# webbrowser.open('index.html')

