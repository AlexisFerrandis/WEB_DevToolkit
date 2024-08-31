<h1 align="center">DevToolkit</h1>

Welcome to **DevToolkit**! This project is a monorepo that consolidates various web development tools to assist developers in improving their workflow.

## Project Structure

This monorepo contains the following components:

- **`frontend/`**: Frontend application built with [Next.js](https://nextjs.org/).
- **`backend/`**: Backend API developed using [Express.js](https://expressjs.com/).
- **`fastapi-service/`**: Service developed with [FastAPI](https://fastapi.tiangolo.com/).

## Prerequisites

Before you start, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (for Next.js and Express.js)
- [Python](https://www.python.org/) (for FastAPI)
- [pip](https://pip.pypa.io/en/stable/) (for installing Python dependencies)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AlexisFerrandis/WEB_DevToolkit.git
cd WEB_DevToolkit
```

### 2. Install Dependencies
#### Frontend (Next.js)
```bash
cd frontend
npm install
```
#### Backend (Express.js)
```bash
cd ../backend
npm install
```
#### Service (FastAPI)
```bash
cd ../fastapi-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running the Application
#### Frontend (Next.js)
```bash
cd frontend
npm run dev
```
#### Backend (Express.js)
```bash
cd ../backend
npm start
```
#### Service (FastAPI)
```bash
cd ../fastapi-service
uvicorn main:app --reload
```


## Contribution
#### Contributions are welcome! To contribute, please follow these steps:

- Fork the repository.
- Create a branch for your changes.
- Commit your changes and push the branch.
- Open a Pull Request.

## Contact
#### For any questions or suggestions, please contact [ alexisferrandis@protonmail.com](alexisferrandis@protonmail.com).

Thank you for using DevToolkit! We hope it helps with your web development projects. 😊