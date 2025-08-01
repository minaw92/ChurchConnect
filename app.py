# Import necessary modules from Flask and other libraries
from flask import Flask, request, jsonify  
from flask_cors import CORS  

###############################################################################
# Core functions

 
################################################################################
# Create a Flask application instance
app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)


###############################################################################
# API Routes

# This will serve the main index.html file to clients
@app.route('/')
def index():
    return app.send_static_file('index.html')


# choice == "1" Add a new member



# choice == "2" Search for a member



# choice == "3" List members by ministry



#choice == "4" View all members



# choice == "5" Delete a member



###############################################################################
# Start the Flask development server
app.run(host='0.0.0.0', port=8000, debug=True)