# MedQueryPro
## Project Objectives
AI Research Retrieval: Utilize AI to quickly access and summarize the latest medical research for healthcare professionals.
Secure Patient Data Collection: Gather necessary patient information without storing it, ensuring privacy and compliance.
Real-Time Insights: Provide on-the-go insights for healthcare professionals to support informed decision-making.
Doctor Availability Management: Enable doctors to easily update their availability for patient consultations.
Appointment Booking: Allow patients to book appointments directly with available doctors, prioritizing emergency cases.

## Database Initialization
Initialize the database: Ensure your SQLite database is set up. Run the initialization script:
`node initialize-db.js`
Running the Application
Start the server:
`node server.js`
Access the application: Open your web browser and navigate to:
`http://localhost:3000`
## File Description:
1. User Registration: Navigate to user-register.html to create a new user account.
2. User Login: Use user-login.html to log in to your account.
3. Patient Interface: Once logged in, users can access the user-mqp.html page to ask questions and receive AI-generated responses.
4. Medical Assistant Interface: Medical assistants can log in via medical-assistant-login.html and manage appointments.
5. Doctor Availability: Doctors can update their availability, and patients can book appointments directly through the interface.
