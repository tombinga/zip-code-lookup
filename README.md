# ZIP Code Lookup Application

A simple web application that allows users to look up city and state information using ZIP codes.

## Features

- ZIP code validation
- City and state lookup using Zippopotam.us API
- Responsive design with modal feedback
- Form validation for name, email, and ZIP code

## Tech Stack

- Node.js
- Express.js
- Axios for API requests
- Pure HTML/CSS/JavaScript frontend

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Visit `http://localhost:3000` in your browser

## Deployment

This application is ready to be deployed to Render.com:

1. Create a new account on [Render](https://render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the deployment:
   - Name: Choose a name for your service
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click "Create Web Service"

## API Reference

This application uses the [Zippopotam.us](https://api.zippopotam.us) API for ZIP code lookups.

## License

MIT
