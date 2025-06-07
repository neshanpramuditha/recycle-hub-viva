# Supabase Authentication Setup Guide

## 🚀 Complete Setup Instructions

### 1. Create Supabase Project

1. **Visit Supabase Dashboard**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up/Login to your account
   - Click "New Project"

2. **Project Configuration**
   - Choose your organization
   - Enter project name: "recycle-hub"
   - Create a strong database password
   - Select a region close to your users
   - Click "Create new project"

### 2. Get Your Credentials

1. **Navigate to Settings**
   - Go to Project Settings → API
   - Copy your `Project URL`
   - Copy your `anon/public` API key

2. **Update Environment Variables**
   - Open your `.env` file
   - Replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 3. Configure Google OAuth

1. **Enable Google Provider**
   - Go to Authentication → Providers
   - Find "Google" and click Configure
   - Enable Google provider

2. **Create Google OAuth App**
   - Visit [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing one
   - Enable Google+ API
   - Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
   - Application type: Web application
   - Authorized redirect URIs:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
   - Copy Client ID and Client Secret

3. **Configure in Supabase**
   - Paste Client ID and Client Secret in Google provider settings
   - Save configuration

### 4. Set Up User Profiles Table (Optional)

Run this SQL in Supabase SQL Editor to create user profiles:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  phone_number text,
  address text,
  city text,
  nic_number text,
  bank_name text,
  account_number text,
  branch text,

  constraint full_name_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Function to handle user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone_number, address, city, nic_number, bank_name, account_number, branch)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'nic_number',
    new.raw_user_meta_data->>'bank_name',
    new.raw_user_meta_data->>'account_number',
    new.raw_user_meta_data->>'branch'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on user registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 5. Test Your Setup

1. **Start Your Development Server**
   ```bash
   npm run dev
   ```

2. **Test Registration Flow**
   - Navigate to `/Register`
   - Fill out the form
   - Check your email for confirmation
   - Confirm your account

3. **Test Login Flow**
   - Navigate to `/Login`
   - Try email/password login
   - Try Google OAuth login

4. **Test Protected Routes**
   - Try accessing `/Sale` or `/Buy` without logging in
   - Should redirect to login page
   - After login, should access pages normally

### 6. Production Configuration

For production deployment:

1. **Update Redirect URLs**
   - Add your production domain to authorized URLs in Google OAuth
   - Update Supabase site URL in project settings

2. **Environment Variables**
   - Set environment variables in your hosting platform
   - Ensure `.env` file is not committed to version control

### 📋 Features Implemented

✅ **Email/Password Authentication**
- User registration with email confirmation
- Login with email and password
- Password visibility toggle
- Form validation and error handling

✅ **Google OAuth Integration**
- One-click Google sign-in/sign-up
- Seamless user experience

✅ **User Interface**
- Responsive design for all screen sizes
- Modern UI with loading states
- Toast notifications for user feedback
- Professional styling with Bootstrap

✅ **Route Protection**
- Protected routes for authenticated users
- Automatic redirect to login for unauthorized access
- Context-based authentication state management

✅ **Navigation Integration**
- Dynamic navigation based on auth state
- Welcome message for logged-in users
- Login/Logout buttons

✅ **User Profile Management**
- Extended user profiles with additional fields
- Banking information (optional)
- Automatic profile creation on registration

### 🔧 Troubleshooting

**Common Issues:**

1. **Google OAuth not working**
   - Check authorized redirect URIs
   - Ensure Google+ API is enabled
   - Verify Client ID/Secret are correct

2. **Email confirmation not received**
   - Check spam folder
   - Verify SMTP settings in Supabase
   - Try with a different email provider

3. **Environment variables not working**
   - Restart development server after changing .env
   - Ensure variables start with VITE_
   - Check for typos in variable names

### 🎯 Next Steps

After setup is complete, you can:
- Customize user profile fields
- Add password reset functionality
- Implement user roles and permissions
- Add social login providers (Facebook, GitHub, etc.)
- Set up email templates
- Add user dashboard/profile pages

Your authentication system is now ready for production use! 🎉
