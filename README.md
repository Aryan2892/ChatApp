# SwiftSpeak

## Description
SwiftSpeak is a real-time chat application built with Node.js, Express, Socket.IO, MongoDB, and React. It provides a simple yet secure platform for users to communicate with each other in real-time.

## Features
- Real-time messaging
- User authentication (login and registration)
- Secure communication with JWT (JSON Web Tokens)
- Chat history retrieval
- Scalable MongoDB database integration

## Installation

### Prerequisites
- Node.js
- MongoDB
- npm (Node Package Manager)

### Setting Up
1. **Clone the repository**
   ```
   git clone https://github.com/Aryan2892/SwiftSpeak.git
   cd ChatApp
   ```

2. **Install server dependencies**
    ```
    cd server
    npm install
    ```

3. **Install client dependencies**
    ```
    cd ../client
    npm install
    ```

4.**Environment Variables**
Set up your MongoDB URI and JWT secret key in a .env file in the server directory.

## Running the Application

1.Start the server
In the server directory, start the Node.js server.
  ```
  Copy code
  cd server
  npm start
  ```

2.Start the client
In a new terminal, navigate to the client directory and start the React app.
  ```
  Copy code
  cd ../client
  npm start
  ```
The client will be available at http://localhost:3000.

## Usage
- Register for a new account or log in with existing credentials.
- Engage in real-time chats with other users.
- Access and view chat history.

## Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request

## License
Distributed under the MIT License. See LICENSE for more information.
