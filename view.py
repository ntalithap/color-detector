from flask import Flask,flash,request,redirect,url_for
from flask import render_template
from werkzeug.utils import secure_filename
import os
import glob
import json

app = Flask(__name__, static_url_path='', static_folder='static')
app.secret_key = os.urandom(24)

#Images are static files, flask will look for them in a static folder
uploads_dir = os.path.join(app.root_path,'static/images/user_images')
os.makedirs(uploads_dir,exist_ok=True)
app.config['upload_dir'] = uploads_dir

@ app.route("/")
def home():
    return render_template("start.html")

@app.route('/detect', methods=['GET','POST'])
def main_page():
    if request.method == 'GET':
        return render_template('main.html', status=None)
    if request.method == 'POST':
        # clear any previously uploaded file (this is to reduce the storage)
        # there is probably a more efficient way of doing this

        types = ('src/static/images/user_images/*.jpg', 'src/static/images/user_images/*.jpeg', 'src/static/images/user_images/*.png')
        matched_files = []
        for files in types:
            matched_files.extend(glob.glob(files))

        for f in matched_files:
            try:
                os.remove(f)
            except OSError as e:
                print("Error: %s: %s" % (f, e.strerror))

        # Check if file is in the request. If not flash a message
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url) #Redirect to the same url

        file = request.files['file']
        # Browser might submit an empty part without filename
        if file.filename == '':
            flash('Empty file')
            return redirect(request.url)
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(uploads_dir, filename))
            return redirect(url_for('allow_click', filename=filename))

@app.route('/detect/uploaded/<filename>')
def  allow_click(filename):
    #look for "filename" in the (designated) static folder
    img_url= url_for('static',filename="images/user_images/" + filename)
    return render_template('main.html',status="uploaded",img_url=img_url)

@ app.route("/sample")
def sample():
    sample_color_data = {}
    with open("./json/samples_data.json", encoding="UTF-8") as f:
        sample_color_data = json.load(fp=f)
    return render_template("sample.html", color_data=sample_color_data)

@ app.route("/picker")
def picker():
    return render_template("picker.html")