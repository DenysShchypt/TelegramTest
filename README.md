README for Social Media Message Viewer System
Social Media Message Viewer System
This application allows users to connect their Telegram account and view all chats and messages associated with it. The app is designed with user-friendly functionality and provides seamless navigation between features.

Features
User Authentication: Login and registration functionality to access the system.
Telegram Account Integration: Connect your Telegram account to the system.
Chat Viewing: Browse the list of all chats associated with the connected Telegram account.
Message Viewing: View all messages within a selected chat.
Account Logout: Disconnect your Telegram account from the system.
System Logout: Log out from the application securely.
Technologies Used
Frontend

- React: A JavaScript library for building user interfaces.
- TypeScript: Used to ensure type safety in the application.
- Axios: For making HTTP requests to the backend API.
- React-Redux: To manage the global state of the application.
- React-Hook-Form: To handle form validations and submissions.

Backend

- FastAPI: A modern, fast (high-performance) web framework for building APIs with Python.

How to Run the Project
Prerequisites
Node.js and npm (or yarn) installed.
Python 3.8+ installed.
Steps
Clone the Repository

bash
Copy code
git clone https://github.com/DenysShchypt/TelegramTest.git
cd telegram-chats

Frontend Setup
Navigate to the frontend directory:
bash
Copy code
cd client-chat
Install dependencies:
bash
Copy code
npm install
Start the development server:
bash
Copy code
npm run dev
The React application will be available at http://localhost:5173.

Backend Setup
Navigate to the backend directory:
bash
Copy code
cd server
Create a virtual environment:
bash
Copy code
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
Install dependencies:
bash
Copy code
pip install -r requirements.txt
Start the FastAPI server:
bash
Copy code
uvicorn main:app --reload
The API will be available at http://localhost:8000.
Connect Frontend and Backend

Update the API base URL in the frontend configuration to point to your FastAPI backend.
