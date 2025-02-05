# Profanity API

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

## Description
The Profanity API is designed to detect and filter profanity in text. It provides an easy-to-use interface for developers to integrate profanity detection into their applications.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Examples](#examples)
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

3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage
To use the Profanity API, you need to set up the server and make requests to the endpoints.

### Starting the Server
```bash
npm start
```

## API Endpoints
| Endpoint       | Method | Description                     |
|----------------|--------|---------------------------------|
| `/check`       | POST   | Check for profanity in text     |
| `/filter`      | POST   | Filter profanity from text      |

## Examples
### Check for Profanity
```bash
curl -X POST http://localhost:3000/check -d '{"text": "Some text with profanity"}'
```

### Filter Profanity
```bash
curl -X POST http://localhost:3000/filter -d '{"text": "Some text with profanity"}'
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
