#!/bin/bash
set -e

NAMESPACE="har-local"
BACKEND_IMG="har-backend:dev"
BASE_DIR=$(dirname "$0")/..

echo "=== Start Minikube if needed ==="
if ! minikube status >/dev/null 2>&1; then
  minikube start --cpus=4 --memory=8192
else
  echo "Minikube already running."
fi

echo "=== Point Docker to Minikube daemon ==="
eval "$(minikube docker-env)"

echo "=== Build backend image ==="
cd "$BASE_DIR"
docker build -t $BACKEND_IMG .

echo "=== Create namespace if missing ==="
kubectl get ns $NAMESPACE >/dev/null 2>&1 || kubectl create ns $NAMESPACE
kubectl config set-context --current --namespace=$NAMESPACE

echo "=== Apply ConfigMap & Secrets ==="
kubectl apply -f backend/infra/local/backend-configmap.yaml

# You can edit tokens here before running the script
GEOCODING_API_KEY='YOUR_MAPBOX_TOKEN'
ROUTING_API_KEY='YOUR_MAPBOX_TOKEN'
MAPILLARY_TOKEN='YOUR_MAPILLARY_TOKEN'

kubectl create secret generic har-backend-secrets \
  --from-literal=GEOCODING_API_KEY="$GEOCODING_API_KEY" \
  --from-literal=ROUTING_API_KEY="$ROUTING_API_KEY" \
  --from-literal=MAPILLARY_TOKEN="$MAPILLARY_TOKEN" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "=== Deploy Redis ==="
kubectl apply -f backend/infra/local/redis-deployment.yaml
kubectl apply -f backend/infra/local/redis-service.yaml
kubectl rollout status deploy/har-redis

echo "=== Deploy Ollama (3B model) ==="
kubectl apply -f backend/infra/local/ollama-deployment.yaml
kubectl rollout status deploy/detourist-ollama

echo "=== 8️Deploy backend ==="
kubectl apply -f backend/infra/local/deployment-backend.yaml
kubectl apply -f backend/infra/local/service-backend.yaml
kubectl rollout status deploy/har-backend-deployment

echo "=== Cluster status summary ==="
kubectl get pods -o wide
kubectl get svc -o wide

echo "===  Testing /health endpoints ==="
BASE="http://$(minikube ip):30080"
curl -s "$BASE/healthz" && echo
curl -s "$BASE/health" && echo

echo "=== Testing route generation ==="
curl -s -H "Content-Type: application/json" -d '{
  "user_prompt": "scenic driving route with parks and viewpoints",
  "origin": { "text": "Central Park, New York, NY" },
  "destination": { "text": "Brooklyn Bridge, New York, NY" },
  "time": { "max_duration_min": 20 },
  "max_results": 3
}' "$BASE/generate-routes" | python3 -m json.tool || true

echo "=== Check logs if needed: ==="
echo "kubectl logs deploy/har-backend-deployment --tail=50"
