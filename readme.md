## MongoDB Practicum

### Steps to run

1. Rename .sample-env to .env
2. Fill in values
3. If running a local MongoDB instance, uncomment the `MONGO_URI` line. Otherwise, fill in the `MONGO_ADMIN_USER` and `MONGO_ADMIN_PASSWORD` fields to connect to Atlas.
    > **Note:** If running MongoDB locally, make sure it is running by doing:
    >
    > ```bash
    > brew services start mongodb-community
    > ```
4. run `npm install` in both the `root` and `client` directories
5. run `npm run seed` in the `root` directory to seed DB
6. Run `npm run dev` in the `root` directory to start the server and client
7. Open `http://localhost:5173` in your browser
