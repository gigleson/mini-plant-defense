-Install frontend dependencies

npm install

Set up the backend

cd server
npm install


-create or update the .env file inside the server folder:

DATABASE_URL="file:./dev.db"

-Run the database migration:

npx prisma migrate dev --name init

-Start the backend
npm run dev