# OpenAI Backend Integration Guide

## Overview

Your backend now supports **both OpenAI and Ollama** as LLM providers. You can switch between them by changing a single environment variable.

## What Changed

### 1. Updated `backend/extraction/llm_providers.py`
- Added `OpenAIProvider` class that calls OpenAI's API
- Updated `LLMProviderManager` to support three modes:
  - `openai` - Use OpenAI exclusively
  - `ollama` - Use Ollama exclusively (your previous setup)
  - `auto` - Try OpenAI first, fallback to Ollama if unavailable

### 2. Updated `backend/infra/local/backend-configmap.yaml`
- Changed `LLM_PROVIDER` from `ollama` to `openai`
- Added `OPENAI_API_KEY` and `OPENAI_MODEL` configuration
- Commented out Ollama settings (kept for easy switching)

## Setup Instructions

### Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys: https://platform.openai.com/api-keys
4. Create a new API key
5. Copy the key (starts with `sk-`)

### Step 2: Update the ConfigMap

Edit `backend/infra/local/backend-configmap.yaml` and replace the placeholder:

```yaml
OPENAI_API_KEY: "sk-your-actual-api-key-here"
```

**⚠️ Security Note**: In production, use Kubernetes Secrets instead of ConfigMaps for API keys!

### Step 3: Apply the Updated Configuration

```bash
kubectl apply -f backend/infra/local/backend-configmap.yaml
```

### Step 4: Restart Your Backend Pods

```bash
kubectl rollout restart deployment/detourist-backend -n har-local
```

### Step 5: (Optional) Scale Down Ollama

Since you're now using OpenAI, you can save resources by scaling down the Ollama deployment:

```bash
kubectl scale deployment/detourist-ollama -n har-local --replicas=0
```

Or delete it entirely:

```bash
kubectl delete -f backend/infra/local/ollama-deployment.yaml
```

## Configuration Options

### Use OpenAI (Recommended for production)

```yaml
LLM_PROVIDER: openai
OPENAI_API_KEY: "sk-..."
OPENAI_MODEL: gpt-4o-mini  # Fast and cost-effective
```

**Cost**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens

### Use Ollama (Good for development/offline)

```yaml
LLM_PROVIDER: ollama
OLLAMA_BASE_URL: http://detourist-ollama:11434
OLLAMA_MODEL: llama3.2:3b-instruct-q4_K_M
```

**Cost**: Free, but requires local compute resources

### Use Auto-Fallback (Best of both worlds)

```yaml
LLM_PROVIDER: auto
OPENAI_API_KEY: "sk-..."
OPENAI_MODEL: gpt-4o-mini
OLLAMA_BASE_URL: http://detourist-ollama:11434
OLLAMA_MODEL: llama3.2:3b-instruct-q4_K_M
```

This will try OpenAI first, and fall back to Ollama if OpenAI is unavailable.

## Available OpenAI Models

| Model | Speed | Quality | Cost | Recommendation |
|-------|-------|---------|------|----------------|
| `gpt-4o-mini` | ⚡⚡⚡ Fast | ⭐⭐⭐ Good | 💰 Low | **Recommended** - Best balance |
| `gpt-4o` | ⚡⚡ Medium | ⭐⭐⭐⭐ Excellent | 💰💰 Medium | Use for complex extractions |
| `gpt-3.5-turbo` | ⚡⚡⚡ Fast | ⭐⭐ Decent | 💰 Very Low | Budget option |

To change models, update the `OPENAI_MODEL` in your ConfigMap.

## Verifying the Setup

### Check Backend Logs

```bash
kubectl logs -f deployment/detourist-backend -n har-local
```

You should see log messages like:
```
[LLM] using OpenAIProvider (gpt-4o-mini)
[LLM] POST https://api.openai.com/v1/chat/completions (model=gpt-4o-mini)
[LLM] rx chars=XXX
```

### Test an API Call

```bash
# Get backend service URL
BACKEND_URL=$(kubectl get svc detourist-backend -n har-local -o jsonpath='{.spec.clusterIP}')

# Test extraction endpoint
curl -X POST http://$BACKEND_URL:8000/api/extract \
  -H "Content-Type: application/json" \
  -d '{"query": "Take me from San Francisco to Golden Gate Bridge"}'
```

## Troubleshooting

### Error: "OpenAI API authentication failed"

- Double-check your API key in the ConfigMap
- Make sure the key starts with `sk-`
- Verify the key is active at https://platform.openai.com/api-keys
- Restart the backend pods after updating the ConfigMap

### Error: "OpenAI API rate limit exceeded"

- You've hit your API rate limit or quota
- Check your usage at https://platform.openai.com/usage
- Add credits to your account or wait for the limit to reset
- Consider setting `LLM_PROVIDER: auto` to fallback to Ollama

### Error: "Cannot connect to OpenAI API"

- Check your internet connectivity from the Kubernetes cluster
- Verify there are no firewall rules blocking api.openai.com
- Check if a proxy is required in your environment

### Backend still using Ollama

- Make sure you applied the ConfigMap changes: `kubectl apply -f ...`
- Restart the backend pods: `kubectl rollout restart deployment/detourist-backend -n har-local`
- Check environment variables in the pod: `kubectl exec -n har-local deployment/detourist-backend -- env | grep LLM`

## Switching Back to Ollama

If you want to switch back to Ollama:

1. Edit `backend/infra/local/backend-configmap.yaml`:
   ```yaml
   LLM_PROVIDER: ollama
   OLLAMA_BASE_URL: http://detourist-ollama:11434
   OLLAMA_MODEL: llama3.2:3b-instruct-q4_K_M
   ```

2. Ensure Ollama is running:
   ```bash
   kubectl get pods -n har-local | grep ollama
   ```

3. If Ollama is scaled down, scale it back up:
   ```bash
   kubectl scale deployment/detourist-ollama -n har-local --replicas=1
   ```

4. Apply and restart:
   ```bash
   kubectl apply -f backend/infra/local/backend-configmap.yaml
   kubectl rollout restart deployment/detourist-backend -n har-local
   ```

## Security Best Practices

### For Development
- Keep API keys in ConfigMaps for convenience
- Use separate API keys for dev/staging/prod
- Set rate limits on your OpenAI keys

### For Production
- **Use Kubernetes Secrets** instead of ConfigMaps
- Enable secret encryption at rest
- Use RBAC to restrict access to secrets
- Consider using a secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager)
- Rotate API keys regularly

Example using Kubernetes Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: openai-secret
  namespace: har-local
type: Opaque
stringData:
  api-key: sk-your-actual-api-key-here
```

Then reference it in your deployment:

```yaml
env:
  - name: OPENAI_API_KEY
    valueFrom:
      secretKeyRef:
        name: openai-secret
        key: api-key
```

## Cost Monitoring

Monitor your OpenAI usage at: https://platform.openai.com/usage

To reduce costs:
1. Use `gpt-4o-mini` instead of `gpt-4o`
2. Implement caching for repeated queries
3. Set up rate limiting in your application
4. Use `LLM_PROVIDER: auto` to fallback to free Ollama when possible

## Next Steps

- [ ] Get OpenAI API key
- [ ] Update ConfigMap with your API key
- [ ] Apply ConfigMap and restart backend
- [ ] Test the integration
- [ ] (Optional) Scale down Ollama to save resources
- [ ] Set up monitoring for API costs
- [ ] Consider implementing caching for repeated queries

## Support

- OpenAI API Docs: https://platform.openai.com/docs/api-reference
- OpenAI Status: https://status.openai.com/
- OpenAI Community: https://community.openai.com/

