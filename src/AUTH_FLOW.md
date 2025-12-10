# Campus Connect - Authentication Flow Documentation

## 🔐 Complete Authentication Flow

### Flow Diagram

```
┌─────────────────┐
│   Landing Page  │
│   (Login Page)  │
└────────┬────────┘
         │
         ├─────────────────────┐
         │                     │
         v                     v
┌────────────────┐    ┌───────────────┐
│   Login Form   │    │ Register Form │
└────────┬───────┘    └───────┬───────┘
         │                    │
         │                    v
         │            ┌────────────────┐
         │            │  Email Valid?  │
         │            │  (.edu domain) │
         │            └────────┬───────┘
         │                     │
         │                     v
         │            ┌────────────────────┐
         │            │ Create User        │
         │            │ status: "pending"  │
         │            └────────┬───────────┘
         │                     │
         │                     v
         │            ┌────────────────────┐
         │            │ Verification       │
         │            │ Pending Page       │
         │            └────────┬───────────┘
         │                     │
         v                     │
┌────────────────┐            │
│ Validate Login │            │
└────────┬───────┘            │
         │                    │
         v                    │
┌────────────────┐            │
│ Check Status   │◄───────────┘
└────────┬───────┘
         │
         ├──────────┬──────────┬──────────┐
         │          │          │          │
         v          v          v          v
    pending    approved   rejected   not found
         │          │          │          │
         v          v          v          v
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │Pending │ │  Main  │ │Rejected│ │ Error  │
    │ Page   │ │  App   │ │ Page   │ │Message │
    └────────┘ └────────┘ └────────┘ └────────┘
```

## Pages & Routes

### Public Pages (No Auth Required)
- `/login` - Login page
- `/register` - Registration page

### Protected Pages (Auth Required + Approved Status)
- `/community` - Community posts (default after login)
- `/events` - Events calendar
- `/marketplace` - Marketplace listings
- `/profile` - User profile
- `/admin` - Admin dashboard
- `/edit-profile` - Edit profile form

### Special Pages
- `/verification` - Shown to pending/rejected users

## User Status States

### 1. Pending
**When:** User just registered and waiting for admin approval

**Behavior:**
- User can log in
- Automatically redirected to `/verification`
- Cannot access main app pages
- Can check status or sign out

**UI Elements:**
- Clock icon with blue background
- Verification criteria checklist
- "Check Status" button
- "Sign Out" button

### 2. Approved
**When:** Admin approved the user account

**Behavior:**
- Full access to all pages
- Can create posts, events, listings
- Can interact with content
- Can edit profile

**UI Elements:**
- Verified badge on profile
- Full navigation menu
- Logout button in navbar

### 3. Rejected
**When:** Admin rejected the user application

**Behavior:**
- User can log in
- See rejection message
- Cannot access main app
- Can only sign out and contact support

**UI Elements:**
- X icon with red background
- Rejection reasons
- Support contact info
- "Return to Login" button

## Authentication Context

### Auth State
```typescript
{
  user: User | null;
  isAuthenticated: boolean;
  login: (email, password) => Promise<result>;
  register: (data) => Promise<result>;
  logout: () => void;
  updateUser: (updates) => void;
}
```

### User Object
```typescript
{
  id: string;
  name: string;
  email: string;
  role: string;          // Current Student, Alumni, Faculty, Staff
  department: string;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  avatar?: string;
  graduationYear?: string;
}
```

## Admin Approval Process

### Step 1: View Pending Users
Admin navigates to Admin page → Pending Approvals tab

### Step 2: Review Application
Each pending user card shows:
- Name, email, avatar
- Role and department
- Graduation year
- Application reason
- Verification criteria checklist:
  * Campus Email Verified ✓
  * Student ID Provided ✓
  * Enrollment Verified ✓
  * Profile Complete ✓

### Step 3: Take Action
- Click "Approve" → User status changes to 'approved'
- Click "Reject" → User status changes to 'rejected'

### Step 4: User Notification
- Toast notification shown to admin
- User can immediately access app (if approved)
- Or see rejection message (if rejected)

## Registration Validation

### Required Fields
- ✅ Full Name
- ✅ Campus Email (must end with .edu)
- ✅ Password (min 6 characters)
- ✅ Role selection
- ✅ Department selection
- ⚪ Graduation year (optional, shown if Student/Alumni)

### Email Validation
```typescript
// Email must end with .edu
if (!email.endsWith('.edu')) {
  return error('Please use a valid campus email address (.edu)');
}

// Email must be unique
if (existingUsers.includes(email)) {
  return error('An account with this email already exists');
}
```

### Password Validation
```typescript
// Minimum 6 characters
if (password.length < 6) {
  return error('Password must be at least 6 characters long');
}

// Passwords must match
if (password !== confirmPassword) {
  return error('Passwords do not match');
}
```

## Security Features

### Protected Routes
```typescript
// Check authentication
if (!isAuthenticated) {
  redirect('/login');
  return;
}

// Check approval status
if (user.status === 'pending') {
  redirect('/verification');
  return;
}

if (user.status === 'rejected') {
  redirect('/verification');
  return;
}

// Allow access to protected pages
showMainApp();
```

### Logout
- Clears `campusconnect_currentUser` from localStorage
- Redirects to `/login`
- Clears auth state

### Session Persistence
- User session stored in localStorage
- Auto-login on page refresh if valid session exists
- Session cleared on logout

## Demo Credentials

### Admin Account
- **Email:** admin@university.edu
- **Password:** (any password)
- **Status:** Approved
- **Access:** All features including Admin dashboard

### Test Registration
1. Use any `.edu` email (e.g., test@campus.edu)
2. Fill in required fields
3. Submit → Status will be "pending"
4. Log in as admin to approve
5. Check status or refresh → Access granted

## Error Handling

### Login Errors
- Invalid email or password
- Account pending approval
- Account rejected
- Empty fields

### Registration Errors
- Email not .edu domain
- Email already exists
- Password too short
- Passwords don't match
- Missing required fields

### Network Errors
- All operations simulated with 500ms delay
- No real network calls
- All data in localStorage

## localStorage Keys

### Data Storage
```javascript
// User database
'campusconnect_users': User[]

// Current session
'campusconnect_currentUser': User
```

### Initial Data
Default admin user created if no users exist:
```javascript
{
  id: '1',
  name: 'Admin User',
  email: 'admin@university.edu',
  role: 'Administrator',
  department: 'Administration',
  verified: true,
  status: 'approved'
}
```

## Testing the Flow

### Test Case 1: New User Registration
1. Navigate to app (shows login page)
2. Click "Sign Up"
3. Fill registration form with .edu email
4. Submit → See "Verification Pending" page
5. Can't access main app yet

### Test Case 2: Admin Approval
1. Open new tab, login as admin
2. Go to Admin page
3. See pending user in list
4. Click "Approve"
5. User is now approved

### Test Case 3: Approved User Access
1. Back to first tab
2. Click "Check Status" or reload page
3. Automatically redirected to Community page
4. Full access to all features

### Test Case 4: Rejection Flow
1. Register new user
2. Login as admin
3. Reject the application
4. User sees rejection message
5. Can only sign out
