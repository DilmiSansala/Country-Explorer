# Countries Explorer - React Application

A web application built with React that consumes the REST Countries API to display information about countries.

## Features

- View information about all countries
- Search for countries by name
- Filter countries by region
- View detailed information about a specific country
- User authentication (login/logout)
- Add countries to favorites (for logged-in users)
- Responsive design for all devices

## Technologies Used

- **Frontend**: React (with functional components and hooks)
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **API Integration**: Axios
- **Testing**: Jest and React Testing Library

## API Integration

The application integrates with the [REST Countries API](https://restcountries.com/) using the following endpoints:

1. `GET /all` - Fetches all countries
2. `GET /name/{name}` - Searches for countries by name
3. `GET /region/{region}` - Filters countries by region
4. `GET /alpha/{code}` - Gets detailed information about a country by its code

## Setup and Installation

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation Steps

1. Clone the repository:
   ```
   git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-DilmiSansala
   cd countries-explorer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Testing

To run tests:
npm test
```

## Deployment

https://country-explorer-steel.vercel.app/

## Project Structure

```
src/
  components/         # Reusable components
    CountryList.js
    CountryCard.js
    SearchBar.js
    FilterOptions.js
    NavBar.js
  pages/              # Page components
    HomePage.js
    DetailPage.js
    LoginPage.js
  contexts/           # React contexts
    SessionContext.js
  services/           # API services 
    api.js
  tests/              # Test files
  App.js              # Main application component
  index.js            # Entry point
```

Challenges and Solutions

Challenge 1: Managing User Sessions

Solution: Implemented a React Context (SessionContext) to manage user authentication state across the application. Used localStorage to persist user data between page refreshes.

 Challenge 2: Handling API Errors
Solution: Implemented error handling for API requests with appropriate user feedback. Added loading states to improve user experience during data fetching.

Challenge 3: Responsive Design
Solution: Used Tailwind CSS's responsive utility classes to ensure the application works well on all device sizes.

## License

MIT

