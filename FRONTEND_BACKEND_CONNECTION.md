# Frontend-Backend Connection Guide

## Architecture

```
Frontend (http://localhost:5174)
    ↓
React App (Vite)
    ↓
AppContext (State Management)
    ↓
API Config (src/config/api.js)
    ↓
Backend (http://localhost:4000)
    ↓
Express + MongoDB
```

## API Configuration

### Base URL
- **Default**: `http://localhost:4000`
- **Configurable via**: `VITE_API_BASE_URL` environment variable in `.env`

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User login |
| `/api/auth/signup` | POST | User registration |
| `/api/devices` | GET/POST | Device management |
| `/api/metrics` | GET/POST | Metrics retrieval |
| `/api/health` | GET | Server health check |

## Frontend Files Modified

### 1. `src/config/api.js` (NEW)
- Centralized API configuration
- Exports `API_ENDPOINTS` object with all endpoint URLs
- Exports `apiFetch()` wrapper function with error handling
- Automatically adds JWT token from localStorage to requests
- Handles timeout and offline scenarios

### 2. `src/context/AppContext.jsx`
- Updated to import and use `API_ENDPOINTS` from config
- `login()` function uses `API_ENDPOINTS.LOGIN`
- `register()` function uses `API_ENDPOINTS.SIGNUP`
- Stores JWT token and user data in localStorage
- Provides enhanced error messages

### 3. `src/components/AuthModal.jsx`
- Form submission handlers with validation
- Shows success message before redirect
- Improved error display (red box with error message)
- 1.5 second delay before redirect (for UX)
- Disabled state during loading

### 4. `src/components/Toast.jsx` (NEW)
- Toast notification component
- Shows success/error/info messages
- Auto-dismisses after 3 seconds (configurable)
- Used for global notifications

### 5. `src/App.jsx`
- Added `ToastContainer` component
- Enables global toast notification system

### 6. `.env` (NEW)
- Environment variables for Vite
- `VITE_API_BASE_URL=http://localhost:4000`

## Backend Verification

The backend is already configured with:
- ✅ CORS enabled for `http://localhost:5173` and `http://localhost:5174`
- ✅ JWT-based authentication (12-hour expiry)
- ✅ MongoDB Atlas connection with fallback to mock mode
- ✅ Comprehensive logging at each authentication step
- ✅ Error handling and validation

## Authentication Flow

### Login Flow
```
1. User enters email + password in AuthModal
2. handleLoginSubmit() validates form
3. AppContext.login() calls API_ENDPOINTS.LOGIN
4. Backend validates credentials and returns {success, token, user}
5. Frontend stores token and user in localStorage
6. Success message shown for 1.5 seconds
7. Redirect to /system-monitor
```

### Signup Flow
```
1. User enters name + email + password + confirmPassword in AuthModal
2. handleRegisterSubmit() validates form
3. AppContext.register() calls API_ENDPOINTS.SIGNUP
4. Backend creates user in MongoDB (or mock mode)
5. Frontend stores token and user in localStorage
6. Success message shown for 1.5 seconds
7. Redirect to /system-monitor
```

## Error Handling

### Frontend Error Messages

| Scenario | Error Message |
|----------|---------------|
| Empty fields | "Field is required" |
| Invalid email | "Invalid email format" |
| Password too short | "Password must be at least 8 characters" |
| Passwords don't match | "Passwords do not match" |
| Server offline | "Server offline. Please make sure backend is running on http://localhost:4000" |
| Invalid credentials | "Invalid credentials" (from backend) |
| Timeout | "Request timeout. Server is not responding." |

### Backend Response Format

**Success (200)**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error (400/401/500)**
```json
{
  "message": "Error description"
}
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Output: ✅ SERVER RUNNING SUCCESSFULLY on http://localhost:4000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Output: ➜  Local:   http://localhost:5174/
```

### Access the App
Open browser: `http://localhost:5174`

## Testing the Login

### Option 1: Create New Account
1. Click "Register" button on login modal
2. Enter name, email, password (8+ chars)
3. Confirm password
4. Click "Create Account"
5. Automatically redirected to dashboard

### Option 2: Test with Existing Account
If you have an existing email registered:
1. Enter email and password
2. Click "Sign In"
3. Automatically redirected to dashboard

### Console Logging
Open browser DevTools (F12) → Console tab to see:
- `📤 Sending login request to backend: {email, url}`
- `📥 Received response from backend: {status, ok}`
- `✅ Login successful: email`

Backend console will show:
- `📧 Login request received: {email, timestamp}`
- `✅ Login successful (database mode): {id, name, email}`

## Troubleshooting

### "Cannot connect to server" Error
1. Verify backend is running: Check port 4000 is open
   ```bash
   netstat -ano | findstr :4000
   ```
2. Check CORS configuration in `backend/src/server.js`
3. Verify `VITE_API_BASE_URL` in `frontend/.env`

### "Invalid credentials" Error
1. Check backend logs for validation errors
2. Verify password meets requirements (8+ chars)
3. Confirm email is correct and registered

### "Request timeout" Error
1. Backend may be overloaded
2. MongoDB connection may be slow
3. Network connectivity issue
4. Increase timeout in `src/config/api.js` if needed

### CORS Errors in Console
1. Check backend CORS origins in `server.js`
2. Ensure frontend URL matches CORS allowed list
3. Clear browser cache and restart dev servers

## Security Features

- ✅ JWT tokens with 12-hour expiry
- ✅ Bcryptjs password hashing (10 salt rounds)
- ✅ CORS enabled only for localhost
- ✅ Helmet security headers
- ✅ Rate limiting (200 requests per 15 min)
- ✅ Input validation with Joi
- ✅ Token stored in localStorage (consider httpOnly cookies for production)

## Next Steps

1. ✅ Frontend login configured
2. ✅ Backend authentication ready
3. ✅ CORS properly setup
4. Next: Test full authentication flow
5. Optional: Add refresh token mechanism
6. Optional: Add password reset functionality
7. Optional: Add 2FA support
