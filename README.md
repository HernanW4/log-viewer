# Log Viewer Application - Developer Guide

## Introduction

Welcome to the Log Viewer Application project! This guide is intended for developers who want to run the application locally for development, testing, or contributions.

The project is fully containerized using Docker and orchestrated with Docker Compose, making the setup process simple and consistent across different environments.

## Prerequisites

Before you begin, ensure you have the following tools installed on your system:

*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

The project follows a fairly standard setup
```text
/
├── client/ # Contains the Angular frontend application and its Dockerfile
├── server/ # Contains the WebSocket backend server and its Dockerfile
├── docker-compose.yml # Orchestrates the building and running of both services
└── .env # If you want to set custom environment variables
```


## Configuration

Application configuration, such as port numbers, is managed through a `.env` file at the root of the project.

1.  Create a file named `.env` in the root directory.
2.  Copy the following content into the file:

    ```env
    # .env

    # Port for the Angular client application
    CLIENT_PORT=4200

    # Port for the WebSocket server
    SERVER_PORT=3000
    ```

You can adjust these ports if they conflict with other services running on your machine.

**DO NOTE THAT BOTH THE CLIENT APP AND SERVER WILL RUN WITH DEFAULT PORTS IF NOT SET IN THE .ENV FILE**

## Running the Application

With Docker and Docker Compose installed, running the entire application stack is a single command.

1.  Open a terminal in the root directory of the project.
2.  Run the following command:

    ```sh
    docker-compose up --build
    ```
    *   `--build`: This flag tells Docker Compose to build the images from the `Dockerfile`s in the `client/` and `server/` directories before starting the containers. You only need to use this flag the first time you run the command or after making changes to the code or Dockerfiles. For subsequent runs, you can simply use `docker-compose up`.

This command will:
*   Build the Docker image for the client application.
*   Build the Docker image for the server application.
*   Create and start containers for both services.
*   Establish a network bridge for the containers to communicate with each other.

You will see the logs from both the client and server applications streamed to your terminal.

## Accessing the Application

Once the containers are running, you can access the application:

*   **Frontend (Client):** Open your web browser and navigate to `http://localhost:8080` (or whichever `CLIENT_PORT` you specified in your `.env` file).
*   **Backend (Server):** The WebSocket server will be running and accessible to the client application at `ws://localhost:3000` (or your specified `SERVER_PORT`).

## Stopping the Application

To stop the application and remove the containers:

1.  Press `Ctrl + C` in the terminal where `docker-compose` is running.
2.  Run the following command to ensure the containers and network are cleanly removed:

    ```sh
    docker-compose down
    ```