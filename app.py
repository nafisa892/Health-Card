from flask import Flask, render_template, request, send_file
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('form.html')

@app.route('/submit', methods=['POST'])
def submit():
    form_data = request.form.to_dict()
    
    # Handle file upload
    file = request.files.get('fileUpload')
    if file and file.filename != '':
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
    else:
        file_path = 'No file uploaded'
    
    form_data['file_path'] = file_path

    return f"<h1>Received Data</h1><pre>{form_data}</pre>"
    
if __name__ == '__main__':
    app.run(debug=True)
