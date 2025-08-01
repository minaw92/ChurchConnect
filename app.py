# Import necessary modules from Flask and other libraries
from flask import Flask, request, jsonify  
from flask_cors import CORS  
import json
###############################################################################
# Core functions

# Load data from JSON files
def load_data():
    with open('members.json', 'r') as f:
        return json.load(f)


# Save data to JSON files
def save_data(data):
    with open('members.json', 'w') as f:
        json.dump(data, f, indent=2)


def add_member(name, age, contact, ministry_group):
    """Add a new member to the directory"""
    members = load_data()

    # Check if member with this name already exists
    for member in members:
        if member['name'].lower() == name.lower():
            return None  # Member already exists

    new_member = {
        "name": name,
        "age": age,
        "contact": contact,
        "ministry_group": ministry_group
    }

    members.append(new_member)
    save_data(members)
    return new_member


def search_member(query):
    """Search for members by name or ministry group"""
    members = load_data()
    query_lower = query.lower()

    results = []
    for member in members:
        if (query_lower in member['name'].lower()
                or query_lower in member['ministry_group'].lower()):
            results.append(member)

    return results


def delete_member(name):
    """
    Delete a member by name .
    Returns True if deleted, False otherwise.
    """
    members = load_data()
    updated_members = []

    deleted = False
    for member in members:
        if member['name'] == name:
            deleted = True
        else:
            updated_members.append(member)

    if deleted:
        save_data(updated_members)
    return deleted


def list_by_ministry(ministry_group):
    """List members by specific ministry group"""
    members = load_data()
    return [
        member for member in members
        if member['ministry_group'].lower() == ministry_group.lower()
    ]

 
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
