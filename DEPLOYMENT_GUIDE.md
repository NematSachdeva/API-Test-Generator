# Deployment Guide - Railway Backend & Vercel Frontend

## Overview

This guide explains how the API Test Generator is deployed across two platforms:
- **Backend**: Flask API deployed on Railway
- **Frontend**: Static HTML/CSS/JS deployed on Vercel

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Frontend                          │
│              (Static HTML/CSS/JavaScript)                   │
│         https://api-test-generator.vercel.app              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ CORS-enabled API calls
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   Railway Backend                           │
│                  (Flask REST API)                           │
│    https://api-test-generator-production.up.railway.app    │
└─────────────────────────────────────────────────────────────┘
```

## Backend Deployment (Railway)

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository connected to Railway

### Deployment Steps

1. **Connect Repository**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose the API-Test-Generator repository

2. **Configure Environment**
   - Set environment variables:
     ```
     FLASK_ENV=production
     PORT=8080
     HOST=0.0.0.0
     ```

3. **Deploy**
   - Railway automatically deploys on push to main branch
   - Backend URL: `https://api-test-generator-production.up.railway.app`

### Backend Configuration

The Flask backend includes CORS support:

```python
from flask_cors import CORS

# Enable CORS for all routes
CORS(app, resources={
    r"/*": {
        "origins": ["*"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

This allows the Vercel frontend to make cross-origin requests.

### API Endpoints

- `GET /health` - Health check
- `GET /` - API information
- `POST /generate-tests` - Generate pytest tests
- `POST /parse` - Parse OpenAPI/Swagger spec

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository

### Deployment Steps

1. **Connect Repository**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import the GitHub repository

2. **Configure Build**
   - Framework: None (Static)
   - Build Command: (leave empty)
   - Output Directory: `src/main/static`

3. **Deploy**
   - Vercel automatically deploys on push
   - Frontend URL: `https://api-test-generator.vercel.app`

### Frontend Configuration

The frontend is configured to call the Railway backend:

```javascript
// API Configuration in src/main/static/script.js
const API_BASE = "https://api-test-generator-production.up.railway.app";

// All API calls use this base URL
fetch(`${API_BASE}/generate-tests`, {
    method: 'POST',
    body: formData,
    headers: {
        'Accept': 'application/json'
    }
});
```

### Static Files

The frontend consists of three files:
- `src/main/static/index.html` - Main UI page
- `src/main/static/style.css` - Styling (dark theme)
- `src/main/static/script.js` - JavaScript logic

These files use relative paths for compatibility:
```html
<link rel="stylesheet" href="./style.css?v=5.0">
<script src="./script.js?v=5.0"></script>
```

## Error Handling

### Frontend Error Messages

The frontend provides clear error messages:

1. **Connection Error**
   - Message: "Cannot connect to backend. Please check your internet connection or try again later."
   - Cause: Backend is unreachable

2. **CORS Error**
   - Message: "CORS error: Backend is not allowing requests from this domain."
   - Cause: CORS not properly configured

3. **Invalid File**
   - Message: "Please select a valid JSON or YAML file"
   - Cause: Wrong file format

4. **Generation Error**
   - Message: "Error: [specific error from backend]"
   - Cause: Backend processing failed

### Backend Error Responses

All errors return JSON with error message:
```json
{
  "error": "Error description"
}
```

## Testing Deployment

### Test Backend

```bash
# Health check
curl https://api-test-generator-production.up.railway.app/health

# API info
curl https://api-test-generator-production.up.railway.app/

# Generate tests
curl -X POST \
  -F "file=@swagger.json" \
  https://api-test-generator-production.up.railway.app/generate-tests
```

### Test Frontend

1. Open https://api-test-generator.vercel.app
2. Upload a Swagger/OpenAPI file
3. Click "Generate Tests"
4. Verify tests are generated

### Test CORS

```bash
# Check CORS headers
curl -i -X OPTIONS \
  -H "Origin: https://api-test-generator.vercel.app" \
  https://api-test-generator-production.up.railway.app/generate-tests
```

## Troubleshooting

### Backend Not Responding

1. Check Railway dashboard for errors
2. View logs: `railway logs`
3. Verify environment variables are set
4. Check if port 8080 is available

### Frontend Not Loading

1. Check Vercel deployment status
2. Clear browser cache
3. Verify static files are in `src/main/static/`
4. Check browser console for errors

### CORS Errors

1. Verify `flask-cors` is installed on backend
2. Check CORS configuration in `app.py`
3. Verify frontend is calling correct backend URL
4. Check browser console for specific error

### File Upload Issues

1. Verify file is valid JSON or YAML
2. Check file size (max 16MB)
3. Verify FormData is being used
4. Check backend logs for parsing errors

## Environment Variables

### Railway Backend

```
FLASK_ENV=production
PORT=8080
HOST=0.0.0.0
UPLOAD_FOLDER=/tmp
```

### Vercel Frontend

No environment variables needed. Backend URL is hardcoded in `script.js`.

## Monitoring

### Backend Monitoring

- Railway provides built-in monitoring
- Check CPU, memory, and request metrics
- View logs in real-time

### Frontend Monitoring

- Vercel provides analytics
- Check deployment status
- View build logs

## Updating Deployment

### Update Backend

1. Make changes to Flask code
2. Commit and push to main branch
3. Railway automatically redeploys
4. Verify at `https://api-test-generator-production.up.railway.app/health`

### Update Frontend

1. Make changes to HTML/CSS/JS
2. Commit and push to main branch
3. Vercel automatically redeploys
4. Verify at `https://api-test-generator.vercel.app`

## Security Considerations

1. **CORS Configuration**
   - Currently allows all origins
   - For production, restrict to specific domains:
   ```python
   CORS(app, resources={
       r"/*": {
           "origins": ["https://api-test-generator.vercel.app"],
           "methods": ["GET", "POST", "OPTIONS"],
           "allow_headers": ["Content-Type"]
       }
   })
   ```

2. **File Upload**
   - Max file size: 16MB
   - Allowed formats: JSON, YAML
   - Files are deleted after processing

3. **API Rate Limiting**
   - Consider adding rate limiting for production
   - Use Flask-Limiter or similar

## Performance Optimization

### Backend
- Use Railway's auto-scaling
- Monitor response times
- Optimize parsing logic

### Frontend
- Vercel provides CDN caching
- Use cache-busting query parameters
- Minimize JavaScript bundle

## Rollback Procedure

### Railway Backend
1. Go to Railway dashboard
2. Select deployment
3. Click "Rollback"
4. Select previous version

### Vercel Frontend
1. Go to Vercel dashboard
2. Select project
3. Go to "Deployments"
4. Click "Rollback" on previous deployment

## Support

For deployment issues:
1. Check Railway/Vercel documentation
2. Review logs in respective dashboards
3. Check GitHub Actions for CI/CD status
4. Open issue on GitHub repository

---

**Backend URL**: https://api-test-generator-production.up.railway.app  
**Frontend URL**: https://api-test-generator.vercel.app  
**Repository**: https://github.com/NematSachdeva/API-Test-Generator
