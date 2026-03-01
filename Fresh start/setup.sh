#!/bin/bash
# ============================================
# NIBL LAB WEBSITE - Full Setup Script
# Run from the root of your cloned repo
# ============================================

echo "🔧 Step 1: Restructuring frontend..."

cd web

# Create folders
mkdir -p css js

# Move files (if they exist in flat structure)
[ -f styles.css ] && mv styles.css css/styles.css
[ -f logging-styles.css ] && mv logging-styles.css css/logging-styles.css
[ -f script.js ] && mv script.js js/script.js
[ -f logging-script.js ] && mv logging-script.js js/logging-script.js

# Remove duplicate files
rm -f "index copy.html" "gallery copy.html"

# Fix CSS/JS paths in all HTML files
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' 's|href="styles.css"|href="css/styles.css"|g' *.html
  sed -i '' 's|href="logging-styles.css"|href="css/logging-styles.css"|g' *.html
  sed -i '' 's|src="script.js"|src="js/script.js"|g' *.html
  sed -i '' 's|src="logging-script.js"|src="js/logging-script.js"|g' *.html
else
  # Linux
  sed -i 's|href="styles.css"|href="css/styles.css"|g' *.html
  sed -i 's|href="logging-styles.css"|href="css/logging-styles.css"|g' *.html
  sed -i 's|src="script.js"|src="js/script.js"|g' *.html
  sed -i 's|src="logging-script.js"|src="js/logging-script.js"|g' *.html
fi

# Fix backslashes in image paths to forward slashes
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' 's|src="\\img\\|src="img/|g' *.html
  sed -i '' 's|src="img\\|src="img/|g' *.html
else
  sed -i 's|src="\\img\\|src="img/|g' *.html
  sed -i 's|src="img\\|src="img/|g' *.html
fi

cd ..

echo "✅ Frontend restructured!"
echo ""
echo "🐍 Step 2: Setting up Django backend..."

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup Django
cd backend
python manage.py makemigrations api
python manage.py migrate
python manage.py seed_data

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the server:"
echo "  source venv/bin/activate"
echo "  cd backend"
echo "  python manage.py runserver"
echo ""
echo "Then visit: http://127.0.0.1:8000/"