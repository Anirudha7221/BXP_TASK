const express = require('express');
const { google } = require('googleapis');
const axios = require('axios');

const app = express();

// Set up Google OAuth2 credentials
const Client_ID = '528437136949-2mgmta2d8iqar7ttrm6gh8tdu3dajaam.apps.googleusercontent.com';
const Client_SECRET = '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';
const Redirect_URI = 'http://localhost:3000/auth/callback';
const Refresh_TOKEN = 'YOUR_Refresh_TOKEN'; // You'll need to obtain this after authenticating

const oAuth2Client = new google.auth.OAuth2(
  Client_ID,
  Client_SECRET,
  Redirect_URI
);

oAuth2Client.setCredentials({
  Refresh_TOKEN: Refresh_TOKEN
});

// Initialize the Gmail API
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

// Retrieve list of last 200 emails
app.get('/emails', async (req, res) => {
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 200
    });

    const messages = response.data.messages;
    const emailList = [];

    for (const message of messages) {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id
      });

      const headers = email.data.payload.headers;
      const sender = headers.find(header => header.name === 'From').value;
      const subject = headers.find(header => header.name === 'Subject').value;

      emailList.push({ sender, subject });
    }

    res.json(emailList);
  } catch (error) {
    console.error('Error retrieving emails:', error);
    res.status(500).json({ error: 'An error occurred while retrieving emails' });
  }
});

app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
  
    if (code) {
      try {
        const { data } = await axios.post('https://oauth2.googleapis.com/token', {
          code,
          client_id: '528437136949-2mgmta2d8iqar7ttrm6gh8tdu3dajaam.apps.googleusercontent.com',
          client_secret: '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',
          redirect_uri: 'http://localhost:3000/auth/callback',
          grant_type: 'authorization_code'
        });
  
        const { access_token, refresh_token } = data;

        res.send('Authorization successful. Tokens obtained.');
      } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        res.status(500).send('Error exchanging code for tokens');
      }
    } else {
      res.status(400).send('Authorization code not found');
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
