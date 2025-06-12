# SMTP Email Setup Guide for Recycle Hub Contact Form

This guide helps you set up Gmail SMTP for your contact form to send emails to `chathuraoriginal2005@gmail.com`.

## 📋 Prerequisites

1. A Gmail account (`chathuraoriginal2005@gmail.com`)
2. Gmail App Password (for security)

## 🔐 Setting up Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Turn on 2-Step Verification

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update .env file**:
   Replace `your_app_password_here` in the `.env` file with your actual app password:
   ```
   SMTP_PASS=your_16_character_app_password
   ```

## 🚀 Running the Application

### Option 1: Run Both Servers Together (Recommended)
```bash
npm run dev-with-email
```

### Option 2: Run Separately
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Email Server
npm run email-server
```

## 📧 How it Works

1. **Frontend** (React): Contact form at `http://localhost:5173/contact`
2. **Email Server** (Node.js): Runs at `http://localhost:8080`
3. **Email Flow**:
   - User fills contact form
   - Frontend sends data to email server
   - Email server processes and sends email via Gmail SMTP
   - Email arrives at `chathuraoriginal2005@gmail.com`

## 🔧 Configuration Details

The email configuration is set in `.env`:
- **SMTP_HOST**: `smtp.gmail.com`
- **SMTP_PORT**: `587`
- **SMTP_USER**: `chathuraoriginal2005@gmail.com`
- **CONTACT_FORM_TO_EMAIL**: `chathuraoriginal2005@gmail.com`

## 📋 Email Template

The system uses a beautiful HTML email template located at:
`public/email-templates/contact.html`

The email includes:
- 🌱 Recycle Hub branding
- 👤 Sender's name and email
- 💬 Full message content
- 🕒 Timestamp
- 📧 Reply-to functionality

## 🐛 Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Make sure you're using an App Password, not your regular Gmail password
   - Verify 2FA is enabled on your Gmail account

2. **"Connection refused"**
   - Check if the email server is running on port 8080
   - Verify no firewall is blocking the connection

3. **"Template not found"**
   - Ensure `public/email-templates/contact.html` exists
   - Check file permissions

### Debug Mode:

The email server runs with debug logging enabled. Check the console for detailed SMTP connection logs.

## 🔒 Security Notes

- Never commit your App Password to version control
- Keep your `.env` file secure
- The email server includes CORS protection
- TLS encryption is enabled for email transport

## 📱 Testing

1. Start both servers: `npm run dev-with-email`
2. Visit: `http://localhost:5173`
3. Navigate to Contact page
4. Fill out the form and submit
5. Check `chathuraoriginal2005@gmail.com` for the email

The contact form includes:
- ✅ Real-time validation
- 🔄 Loading states
- 🎉 Success/error notifications
- 📱 Responsive design
- 🌙 Dark/light theme support
