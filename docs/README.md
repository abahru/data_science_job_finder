# Data Science Job Finder

A web application that helps users discover real-time job listings in the data industry, including roles like Data Scientist, Data Analyst, and Machine Learning Engineer. Users can filter jobs, save listings, and explore hiring trends through interactive charts.

## Target Browsers

This application works on all major desktop browsers:
- Chrome
- Firefox
- Edge
- Safari

Optimized for desktop experience (laptop and full screen usage).

## Developer Manual

This section is for developers who wish to maintain or extend this system.

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/data-science-job-finder.git
   cd data-science-job-finder
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Run the backend server**
   ```bash
   node server.js
   ```
   Your server will run at `http://localhost:3000`.

4. **Open the frontend**
   - Use Live Server to open `index.html`
   - Or deploy the full app via Vercel

### Running Tests

No formal test suite is included. You can test manually by:

- Visiting:  
  `http://localhost:3000/test`  
  to confirm the server is up

- Sending mock feedback:
  ```js
  fetch('http://localhost:3000/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Aaliyah', message: 'Great site!' })
  });
  ```

### API Documentation

#### `GET /jobs`

- **Description:** Fetches job listings from Adzuna
- **Query Parameters:**
  - `page` (default: 1)
  - `query` (default: "data science")

- **Example:**  
  `GET http://localhost:3000/jobs?page=2&query=data%20analyst`

#### `POST /feedback`

- **Description:** Accepts mock feedback
- **Request Body (JSON):**
  ```json
  {
    "name": "Aaliyah",
    "message": "Great site!"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Feedback received successfully!",
    "data": {
      "name": "Aaliyah",
      "message": "Great site!"
    }
  }
  ```

## Known Issues

- Filters only apply to the current page (API does not return all pages at once)
- App is desktop-optimized only
- Some job results may lack salary or location data

## Roadmap

- Integrate Supabase to save jobs permanently
- Add login/account functionality
- Improve mobile responsiveness
- Add more filters (e.g., experience level, remote only)

## Technologies Used

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js with Express
- **API Source:** [Adzuna Job Search API](https://developer.adzuna.com/)
- **Visualization:** Chart.js
- **Storage:** LocalStorage (browser)
- **Deployment:** Vercel (Frontend)
