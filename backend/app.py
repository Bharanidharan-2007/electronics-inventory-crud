import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Component
from sqlalchemy.exc import IntegrityError
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Enable CORS for frontend
CORS(app)

# Use SQLite database in the backend directory
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'inventory.db')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', f'sqlite:///{db_path}')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Serve static files from the Vite build output
dist_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dist')
app.static_folder = dist_path
app.static_url_path = ''

@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    # For SPA, always return index.html if the route is not found and doesn't start with /api
    if request.path.startswith('/api/'):
        return jsonify({"error": "Not found"}), 404
    return app.send_static_file('index.html')

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/components', methods=['POST'])
def create_component():
    """
    Create a new component.
    Validates required fields, checks for duplicate name+category combinations,
    and ensures quantity is non-negative.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    name = data.get('name')
    category = data.get('category')
    quantity = data.get('quantity')
    location = data.get('location')

    if not all([name, category, location]) or quantity is None:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        quantity = int(quantity)
        if quantity < 0:
            return jsonify({"error": "Quantity must be >= 0"}), 400
    except ValueError:
        return jsonify({"error": "Quantity must be an integer"}), 400

    new_component = Component(
        name=name,
        category=category,
        quantity=quantity,
        location=location
    )
    
    try:
        db.session.add(new_component)
        db.session.commit()
        return jsonify(new_component.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Duplicate component: name and category must be unique"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/components', methods=['GET'])
def list_components():
    category = request.args.get('category')
    try:
        query = Component.query
        if category:
            query = query.filter_by(category=category)
        components = query.all()
        return jsonify([c.to_dict() for c in components]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/components/<int:comp_id>', methods=['GET'])
def get_component(comp_id):
    try:
        component = db.session.get(Component, comp_id)
        if not component:
            return jsonify({"error": "Component not found"}), 404
        return jsonify(component.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/components/<int:comp_id>', methods=['PUT'])
def update_component(comp_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    try:
        component = db.session.get(Component, comp_id)
        if not component:
            return jsonify({"error": "Component not found"}), 404

        if 'name' in data:
            component.name = data['name']
        if 'category' in data:
            component.category = data['category']
        if 'location' in data:
            component.location = data['location']
        if 'quantity' in data:
            try:
                quantity = int(data['quantity'])
                if quantity < 0:
                    return jsonify({"error": "Quantity must be >= 0"}), 400
                component.quantity = quantity
            except ValueError:
                return jsonify({"error": "Quantity must be an integer"}), 400

        db.session.commit()
        return jsonify(component.to_dict()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Duplicate component: name and category must be unique"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/components/<int:comp_id>', methods=['DELETE'])
def delete_component(comp_id):
    try:
        component = db.session.get(Component, comp_id)
        if not component:
            return jsonify({"error": "Component not found"}), 404
        
        db.session.delete(component)
        db.session.commit()
        return jsonify({"message": "Deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
