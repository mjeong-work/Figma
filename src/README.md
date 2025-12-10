# Campus Connect

A campus networking web application where verified users can browse community posts, events, marketplace listings, and connect with fellow students, alumni, and faculty.

## Features

### 🔐 Authentication System
- **Login** - Secure login with campus email and password
- **Registration** - Sign up with campus email (.edu domain required)
- **Verification** - Admin approval system for new users
- **Protected Routes** - Automatic redirect to login for unauthenticated users

### 📱 Main Pages
- **Community Boards** - Browse and create posts, filter by student/alumni categories
- **Events** - Discover campus events with calendar view and RSVP
- **Marketplace** - Buy and sell items with other campus members
- **Profile** - View your activity, posts, and account information
- **Admin Dashboard** - Approve users, view analytics, manage reports

## Getting Started

### Demo Login
Use these credentials to access the app immediately:
- **Email:** `admin@university.edu`
- **Password:** Any password

### Creating a New Account
1. Click "Sign Up" on the login page
2. Fill in your information (use a `.edu` email)
3. Submit your application
4. Wait for admin approval (or use admin account to approve yourself)
5. Once approved, you can access all features

## Authentication Flow

### User Registration
1. User fills out registration form with:
   - Full name
   - Campus email (.edu domain)
   - Password (min 6 characters)
   - Role (Student, Alumni, Faculty, Staff)
   - Department/Major
   - Graduation year (optional)

2. System validates:
   - Email must end with `.edu`
   - Email must be unique
   - Password requirements met

3. User is created with `status: 'pending'`

4. User is redirected to verification pending page

### Admin Approval
1. Admin logs in and navigates to Admin page
2. Views list of pending user applications
3. Reviews verification criteria:
   - Campus email verified ✓
   - Student ID provided ✓
   - Enrollment verified ✓
   - Profile complete ✓

4. Clicks "Approve" or "Reject"

5. User's status is updated and they can access the app

### Protected Routes
- Unauthenticated users are redirected to login page
- Users with `status: 'pending'` are redirected to verification page
- Users with `status: 'rejected'` see rejection message
- Only users with `status: 'approved'` can access main pages

## Tech Stack
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **localStorage** - Data persistence
- **Hash-based routing** - Navigation

## Project Structure
```
/
├── LoginPage.tsx              # Login form
├── RegisterPage.tsx           # Registration form
├── VerificationPendingPage.tsx # Pending approval screen
├── CommunityPage.tsx          # Community posts
├── EventsPage.tsx             # Events calendar
├── MarketplacePage.tsx        # Marketplace listings
├── ProfilePage.tsx            # User profile
├── AdminPage.tsx              # Admin dashboard
├── EditProfilePage.tsx        # Edit profile form
├── utils/
│   └── authContext.tsx        # Authentication logic & context
└── components/
    ├── NavigationBar.tsx      # Top nav with logout
    ├── PostCard.tsx          # Community post card
    ├── EventCard.tsx         # Event card
    ├── MarketplaceCard.tsx   # Marketplace item card
    └── ui/                   # shadcn/ui components
```

## Data Storage

All data is stored in `localStorage` for demo purposes:

- `campusconnect_users` - Array of all registered users
- `campusconnect_currentUser` - Currently logged-in user

### User Data Structure
```typescript
{
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  avatar?: string;
  graduationYear?: string;
}
```

## Key Features

### Search & Filtering
- **Community:** Search posts, filter by category (Current Students, Alumni, All School), sort by date/likes
- **Events:** Search events, filter by date, sort by date/popularity
- **Marketplace:** Search items, filter by category, sort by price/date

### User Actions
- Create posts with text and images
- Create events with details and dates
- List marketplace items with photos
- Like and comment on posts
- RSVP to events
- Contact sellers

### Admin Features
- View pending user approvals
- Approve/reject users with one click
- View analytics and platform stats
- Monitor reported content
- Track user growth metrics

## Security Notes

⚠️ **This is a demo application:**
- Passwords are not actually validated (any password works)
- Real apps should use proper authentication (OAuth, JWT, etc.)
- PII should be handled according to privacy regulations
- Use proper backend with secure password hashing
- Implement rate limiting and CSRF protection

## Future Enhancements

Potential improvements for production:
- Real backend API with database
- Email verification system
- Password reset functionality
- Two-factor authentication
- Real-time notifications
- Direct messaging
- File upload to cloud storage
- Advanced search with Elasticsearch
- Mobile app (React Native)

## License

This is a demo project created for educational purposes.
