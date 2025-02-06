# Profanity API

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)
![Technology](https://img.shields.io/badge/technology-Bun.js-blue)

## Description
The Profanity API was created to provide an endpoint that can quickly and efficiently respond to words or phrases that are considered offensive or inappropriate. Its primary goal is to filter out content that could harm a healthy community, thereby cleaning up chats and fostering a more positive environment. By using this API, developers can help prevent toxic behavior and promote a healthier community.

This API utilizes a vector database for words and similarities, along with Langchain to handle contextual understanding. It offers an easy-to-use interface for integrating profanity detection into applications.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Examples](#examples)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Installation
To install the Profanity API, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Lostovayne/Profanity-Api.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Profanity-Api
   ```

3. Install the dependencies using Bun:
   ```bash
   bun install
   ```

4. Create the vector database in Upstash.

5. Seed the database with initial data:
   ```bash
   bun run seed.ts
   ```

## Usage
To use the Profanity API, you need to set up the server and make requests to the endpoints.

### Starting the Server
You can run the server using:
```bash
bun index.ts
```
or using Wrangler:
```bash
bun wrangler dev index.ts
```

## API Endpoints
| Endpoint       | Method | Description                     |
|----------------|--------|---------------------------------|
| `/`       | POST   | Check for profanity in text     |
| `/`      | POST   | Filter profanity from text      |

### Request Parameters
For both endpoints, the request body should be a JSON object containing the following parameter:

- `text` (string): The text to check or filter for profanity.

### Example Request
#### Check for Profanity
```bash
curl -X POST http://localhost:3000/ -d '{"text": "Some text with profanity"}'
```


### Response Format
The API will return a JSON response. Here’s an example response for the `/check` endpoint:

```json
{
  "isProfanity": true,
  "score": 0.95,
  "flaggedFor": "profanity word"
}
```

```

## Environment Variables
You need to set the following environment variables in your `.env` file:

- `VECTOR_URL`: The URL for your Upstash vector database.
- `VECTOR_TOKEN`: The token for authenticating with your Upstash vector database.

Example `.env` file:
```plaintext
VECTOR_URL="https://your-upstash-vector-url"
VECTOR_TOKEN="your-upstash-token"
```

## Contributing
Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
