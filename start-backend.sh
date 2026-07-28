#!/bin/bash
echo "Starting Portfolio Backend..."
echo "Backend will be available at http://localhost:8080"
echo "H2 Console at http://localhost:8080/h2-console"
echo ""
cd "$(dirname "$0")/backend"
mvn spring-boot:run
