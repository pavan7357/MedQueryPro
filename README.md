# MedQueryPro
## Project Objectives
1. AI Research Retrieval: Utilize AI to quickly access and summarize the latest medical research for healthcare professionals.
2. Secure Patient Data Collection: Gather necessary patient information without storing it, ensuring privacy and compliance.
3. Real-Time Insights: Provide on-the-go insights for healthcare professionals to support informed decision-making.
4. Doctor Availability Management: Enable doctors to easily update their availability for patient consultations.
5. Appointment Booking: Allow patients to book appointments directly with available doctors, prioritizing emergency cases.

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
