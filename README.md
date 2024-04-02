
# Web Scraping API with Node.js for obtaining leads from Sales River

This project is a Node.js application that uses Express, Puppeteer, Cheerio, and CORS to perform web scraping on specific pages after authentication. It's designed to extract structured information from web pages and return it in JSON format.

## Why?

Because this third party ONLY allows the sending of leads via Zapier. I have a crusade against Zapier, as per my only other public project (GHLFreeRelay) which helps defeat this some problem when other companies follow the same boneheaded path as Go High Level and Zapier. Introducing: Sales River. The software that offers "integrations" with an s, with... Zapier only. Yikes! 

Using my tools, you will spend $0 with Zapier. You should not have to PAY to send DATA on the INTERNET. The most mindless thing ever is that people tolerate this. 

This same company offers to SMS (Text) or email the leads, but they just provide a link. There are a few anti-bot practices on their end (you know, because why just give you the leads you've paid for when they can make you jump through hoops... or pay Zapier), which is why some of this code is a bit obtuse. Enjoy!

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


## Other Notes

It is highly likely that you will still need to do your own parsing - either of the email, or their incoming SMS that contain the link. This way, you can track, parse, extract, log and queue these processes somewhere. Whatever language you use to perform the other task, all it really has to do is be able to POST the URL to the endpoint created by this script. The response back will contain all the information you need to insert the lead in your database (via JSON). 

There are environment variables for controlling the access allowed (from your other server), as well as the Sales River client (assuming it may not be Consumer Affairs), and a few other parameters. A future update may allow the response to be sent to a different (or multiple) other endpoints waiting for the JSON, but it is not currently a priority.


## Contributing

Branch your own!

## Versioning

Branch your own!

## Authors

- **saintpetejackboy**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


