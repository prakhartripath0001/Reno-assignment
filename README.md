# Notice Board

## Project Overview
Notice Board is a comprehensive full-stack web application designed for creating, managing, and viewing important notices. It features a responsive grid interface, allowing users to categorize notices (General, Event, Exam), set priorities (Normal, Urgent), and optionally upload images via Cloudinary. The backend is powered by Next.js API Routes and a TiDB Serverless database integrated through Prisma ORM.

## Installation
To install and set up the project locally, follow these steps:

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone <your-repo-url>
   cd notice-board
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

## Environment Variables
Create a `.env` file in the root of the project and provide the following variables. Do not commit this file to version control.

```env
# Database configuration
DATABASE_URL="mysql://<username>:<password>@<tidb-host>:<port>/noticeboard?sslaccept=strict"

# Cloudinary configuration for image uploads
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<your-cloud-name>"
NEXT_PUBLIC_CLOUDINARY_PRESET="<your-upload-preset>"
```

## How to Run
Once the dependencies are installed and the environment variables are configured, you can start the development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## Database
This project uses Prisma ORM version 7 with a MariaDB/MySQL adapter specifically configured for TiDB Serverless. 

To apply database schema changes or initialize the database:
```bash
npx prisma migrate dev --name init
```

To view and interact with your data in a graphical interface:
```bash
npx prisma studio
```

## Deployment
The application is optimized for deployment on Vercel. 
1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the required Environment Variables in the Vercel dashboard.
4. Deploy the application. Vercel will automatically run the build command (`next build`).

## Future Improvements
- Implement user authentication and role-based access control (RBAC) so that only administrators can create, edit, or delete notices.
- Add pagination or infinite scrolling for the notices feed to handle large volumes of data.
- Integrate rich-text formatting for notice bodies to support links, bold text, and lists.
- Add filtering and search functionality on the frontend to easily locate specific notices.


