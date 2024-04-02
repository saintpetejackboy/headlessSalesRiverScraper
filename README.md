
# Web Scraping API with Node.js

This project is a Node.js application that uses Express, Puppeteer, Cheerio, and CORS to perform web scraping on specific pages after authentication. It's designed to extract structured information from web pages and return it in JSON format.

## Features

- Secure login and session handling using Puppeteer.
- Efficient parsing of HTML content with Cheerio.
- CORS configuration for secure cross-origin requests.
- Environment variable management for sensitive information.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v12.x or later recommended)
- npm (usually comes with Node.js)

### Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/yourprojectname.git
```

2. Navigate to the project directory:

```bash
cd yourprojectname
```

3. Install the required dependencies:

```bash
npm install
```

4. Create a `.env` file in the root of your project (or in `/var/www/envfiles/` as specified in your project) and populate it with the necessary environment variables based on the provided example:

```
EMAIL=user@gmail.com
PASSWORD=pAsSwOrD
CHROME_PATH=/path/to/your/chrome
QUERY_SERVER=https://yourEndpoint.com
BASE_URL=https://marketplace.consumeraffairs.com
```

### Usage

Start the server with:

```bash
npm start
```

Or directly with Node:

```bash
node index.js
```

The server will start running on `http://localhost:3333`.

#### Making Requests

To perform a web scraping operation, send a GET request to `/scrape` with the `path` query parameter specifying the path to scrape. The address used can be local or remote. For example:

```
http://localhost:3333/scrape?path=6330d0cf-1c92-44d3-838c-8c0fe05f8010
```

The response will be a JSON object containing the scraped data.

## Built With

- [Express](https://expressjs.com/) - The web framework used
- [Puppeteer](https://pptr.dev/) - For automated web browser control
- [Cheerio](https://cheerio.js.org/) - Used to parse and manipulate HTML
- [CORS](https://github.com/expressjs/cors) - Middleware to enable CORS

## Contributing

Branch your own!

## Versioning

Branch your own!

## Authors

- **saintpetejackboy**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


