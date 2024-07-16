# Read differences.txt content
with open('differences.txt', 'r', encoding='utf-8') as f:
    differences = f.read()

# Prepare HTML content with Bootstrap "Heroes" template
html_content = """
<!DOCTYPE html>
<html lang="en" data-bs-theme="auto">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Differences</title>
    <link href="https://getbootstrap.com/docs/5.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://getbootstrap.com/docs/5.3/examples/heroes/heroes.css" rel="stylesheet">
    <style>
        .diff-number {
            margin-top: 20px;
            font-weight: bold;
        }
        .remove {
            color: red;
        }
        .add {
            color: green;
        }
        .changes {
            color: blue;
        }
        .card {
            margin-bottom: 20px;
        }
        .preformatted {
            background-color: #fff;
            padding: 15px;
            border-radius: 5px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .badge-remove {
            background-color: #dc3545;
        }
        .badge-add {
            background-color: #28a745;
        }
        .badge-changes {
            background-color: #007bff;
        }
        .form-check-input {
            width: 30px;
            height: 30px;
            margin-right: 10px;
        }
        .form-check-input:checked ~ .container-fluid {
            text-decoration: line-through;
            background-color: #f0f0f0; /* Light gray background */
        }
    </style>
</head>
<body>
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <symbol id="check2" viewBox="0 0 16 16">
            <path d="M2.5 8.5l3 3 8-8" />
        </symbol>
        <symbol id="circle-half" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 0 8 1v14z" />
        </symbol>
        <symbol id="moon-stars-fill" viewBox="0 0 16 16">
            <path d="M6 0a.5.5 0 0 1 .5.5V2h1.5a.5.5 0 0 1 .354.854l-1.5 1.5a.5.5 0 0 1-.707 0l-1.5-1.5A.5.5 0 0 1 4 2H5.5V.5A.5.5 0 0 1 6 0z" />
            <path d="M14.567 10.239a.5.5 0 0 1-.51.02 4.992 4.992 0 0 1-1.986-1.986.5.5 0 0 1 .02-.51 6.987 6.987 0 0 0 1.527-4.75 7 7 0 1 0-8.345 8.345c1.623-.36 3.063-1.1 4.286-2.057a4.992 4.992 0 0 1 2.057-4.286.5.5 0 0 1 .51.02 6.987 6.987 0 0 0 4.75 1.527.5.5 0 0 1 .02.51z" />
        </symbol>
        <symbol id="sun-fill" viewBox="0 0 16 16">
            <path d="M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zM3.343 1.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 1 1-.707.707L3.343 2.05a.5.5 0 0 1 0-.707zM1.5 7.5a.5.5 0 0 1 0-1h2a.5.5 0 0 1 0 1h-2zm9-1a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1h2zm4.657 3.343a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM12.95 12.657a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 1 1 .707.707l-1.414 1.414zM8 14a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5z" />
        </symbol>
    </svg>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <a class="navbar-brand" href="#">Differences</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
    </nav>
    <main>
        <div class="container py-4">
"""

# Generate the difference sections
difference_sections = differences.strip().split("\n\n\n")
for i, section in enumerate(difference_sections):
    remove_text = section.split("- REMOVE")[1].split("+ ADD")[0].strip()
    add_text = section.split("+ ADD")[1].split("+- CHANGES")[0].strip()
    changes_text = section.split("+- CHANGES")[1].strip()
    
    section_html = """
    <div class="p-5 mb-4 bg-light rounded-3">
        <div class="container-fluid py-5">
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="diff-check-{diff_number}">
                <label class="form-check-label" for="diff-check-{diff_number}">
                    DIFF NUMBER {diff_number}
                </label>
            </div>
            <span class="badge badge-remove">REMOVE</span>
            <div class="preformatted remove">{remove_text}</div>
            <br>
            <span class="badge badge-add">ADD</span>
            <div class="preformatted add">{add_text}</div>
            <br>
            <span class="badge badge-changes">CHANGES</span>
            <div class="preformatted changes">{changes_text}</div>
        </div>
    </div>
    """.format(diff_number=i+1, remove_text=remove_text, add_text=add_text, changes_text=changes_text)
    
    html_content += section_html

# Close the main content
html_content += """
        </div>
    </main>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script>
        document.querySelectorAll('.form-check-input').forEach(item => {
            item.addEventListener('change', event => {
                if (item.checked) {
                    // Strike through the entire section
                    item.closest('.container-fluid').style.textDecoration = 'line-through';
                    item.closest('.container-fluid').style.backgroundColor = '#f0f0f0'; // Light gray background
                } else {
                    item.closest('.container-fluid').style.textDecoration = 'none';
                    item.closest('.container-fluid').style.backgroundColor = '#fff'; // Default white background
                }
            })
        })
    </script>
</body>
</html>
"""

# Write HTML content to index.html
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("HTML file created as index.html")
