# Frontend-Backend Connection - Testing Guide

## ✅ Current Status

### Backend Server (http://localhost:4000)
- ✅ Running with nodemon (auto-restart on file changes)
- ✅ MongoDB Atlas connected
- ✅ CORS enabled for http://localhost:5173 and http://localhost:5174
- ✅ Authentication endpoints ready
- ✅ Comprehensive logging enabled

### Frontend Server (http://localhost:5174)
- ✅ Running with Vite dev server
- ✅ Hot reload enabled (auto-restart on file changes)
- ✅ Environment variables loaded from .env
- ✅ API configuration centralized in src/config/api.js
- ✅ Enhanced authentication forms with error handling

## 🧪 Testing the Login Connection

### Step 1: Open the Application
```
URL: http://localhost:5174
```

### Step 2: Test Registration (Create New Account)
1. Click "Register" button in the login modal
2. Fill in the form:
   - **Full Name**: John Doe
   - **Email**: john@example.com (use unique email)
   - **Password**: Test@1234 (must be 8+ chars with lowercase, number, special char)
   - **Confirm Password**: Test@1234
3. Click "Create Account"
4. **Expected Result**:
   - Backend logs: `✅ Login successful (database mode): {name, email}`
   - Frontend shows: "✅ Account created successfully! Redirecting to dashboard..."
   - Page redirects to system-monitor dashboard after 1.5 seconds
   - Browser console logs show request/response details

### Step 3: Test Login
1. Logout by clicking the logout button (bottom sidebar)
2. Click "Sign In" button
3. Fill in the form:
   - **Email**: john@example.com
   - **Password**: Test@1234
4. Click "Sign In"
5. **Expected Result**:
   - Backend logs: `✅ Login successful (database mode): {id, name, email}`
   - Frontend shows: "✅ Login successful! Redirecting to dashboard..."
   - Page redirects to system-monitor dashboard after 1.5 seconds
   - User data stored in localStorage (check DevTools → Application → Local Storage)

### Step 4: Verify Console Logging
Open DevTools (F12) and check the Console tab:

#### Frontend Console (Should see):
```
📤 Submitting login form: {email: "john@example.com"}
📤 Sending login request to backend: {email: "john@example.com", url: "http://localhost:4000/api/auth/login"}
📥 Received response from backend: {status: 200, ok: true}
✅ Login successful: john@example.com
```

#### Backend Console (Should see):
```
📧 Login request received: {email: "john@example.com", timestamp: "2026-03-04T..."}
🗄️ Querying MongoDB for user: john@example.com
✅ Login successful (database mode): {id: "...", name: "John Doe", email: "john@example.com"}
```

## 🔍 Troubleshooting Checklist

### Issue: "Cannot connect to server"
**Check:**
1. Backend running on port 4000?
   ```bash
   netstat -ano | findstr :4000
   ```
2. Both terminal windows showing "SERVER RUNNING SUCCESSFULLY"?
3. Check VITE_API_BASE_URL in frontend/.env:
   ```
   VITE_API_BASE_URL=http://localhost:4000
   ```

### Issue: Form shows error but no backend message
**Check:**
1. Email format validation (must contain @)
2. Password length (minimum 8 characters)
3. Name length (minimum 2 characters)
4. Look for error message in red box under form

### Issue: Redirect not working
**Check:**
1. Browser allowing navigation (check DevTools for blocked redirects)
2. Check /system-monitor route exists in App.jsx
3. Check if isAuthenticated is properly set:
   - Open DevTools → Application → Local Storage
   - Should see "token" and "user" stored

### Issue: "Email already registered"
**Solution:**
- Use a different email address for testing
- Or register with unique email each time

## 📊 Data Flow Verification

### Successful Login Flow
```
User Input (AuthModal)
    ↓
handleLoginSubmit() validates form
    ↓
login() called via AppContext
    ↓
fetch() to http://localhost:4000/api/auth/login
    ↓
Backend validates credentials
    ↓
MongoDB lookup (or mock mode)
    ↓
Password comparison with bcryptjs
    ↓
JWT token generated
    ↓
Response: {success: true, token, user}
    ↓
Frontend stores in localStorage
    ↓
setIsAuthenticated(true)
    ↓
Show success message (1.5 sec)
    ↓
Redirect to /system-monitor
```

## 🔐 Authentication State

### Check Authentication State
DevTools → Application → Local Storage → Look for:
```javascript
token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
user: {"id":"...","name":"...","email":"...","role":"..."}
```

### Check JWT Token Details
Use https://jwt.io to decode the token. Should contain:
```javascript
{
  "sub": "user_id_from_mongodb",
  "role": "user",
  "iat": timestamp_issued,
  "exp": timestamp_expiry
}
```

## 🚀 Performance Notes

### Normal Response Times
- Registration: 1-2 seconds (includes password hashing)
- Login: 500ms - 1 second
- Redirect: Automatic after 1.5 seconds

### If Response Takes >5 Seconds
- MongoDB connection might be slow
- Check internet connectivity
- Increase timeout in src/config/api.js (default: 10 seconds)

## 📝 API Response Examples

### Successful Login Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Failed Login Response
```json
{
  "message": "Invalid credentials"
}
```

### Validation Error Response
```json
{
  "message": "email is required"
}
```

## 🎯 Next Steps After Successful Login

1. ✅ Test registration and login flows
2. ✅ Verify data persists in localStorage
3. ✅ Check console logs are detailed
4. ✅ Test dashboard loads after redirect
5. Next: Test other protected routes
6. Next: Test logout functionality
7. Next: Test error scenarios (wrong password, non-existent user)

## 📞 Common Questions

### Q: Why does the password need to be 8+ characters?
**A:** Set in Joi validation schema in backend (src/routes/authRoutes.js). Change if needed.

### Q: Can I change CORS allowed origins?
**A:** Yes, edit backend/src/server.js:
```javascript
origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174'],
```

### Q: How long does JWT token last?
**A:** 12 hours from issue time (configured in authRoutes.js)

### Q: Is password stored in plain text?
**A:** No, hashed with bcryptjs (10 salt rounds) before storing in MongoDB

### Q: Can I deploy this to production?
**A:** Yes, but first:
1. Move JWT_SECRET to environment variable
2. Use httpOnly cookies instead of localStorage
3. Enable HTTPS
4. Update CORS origins to production domain
5. Move MongoDB credentials to secrets manager

## ✨ Success Indicators

You'll know everything is working when:
- ✅ Registration creates account and logs in automatically
- ✅ Login redirects to dashboard after 1.5 seconds
- ✅ User data appears in localStorage
- ✅ Console shows all expected logging messages
- ✅ Backend logs show each authentication step
- ✅ No CORS errors in browser console
- ✅ No network errors in DevTools
- ✅ Token is valid JWT format

---

**Last Updated**: March 4, 2026
**Status**: All systems operational ✅
