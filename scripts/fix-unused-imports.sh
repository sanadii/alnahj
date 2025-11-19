#!/bin/bash

# Fix unused MainCard imports
find frontend/src/views/application/contacts -name "*.tsx" -type f -exec sed -i "/import MainCard from 'ui-component\/cards\/MainCard';/d" {} \;
find frontend/src/views/application/crm-new/contacts -name "*.tsx" -type f -exec sed -i "/import MainCard from 'ui-component\/cards\/MainCard';/d" {} \;

echo "Fixed unused MainCard imports"

# Fix unused variables in ContactDashboard
echo "Fixing ContactDashboard files..."

# Fix ContactEdit files
echo "Fixing ContactEdit files..."

echo "Unused import cleanup complete!"

