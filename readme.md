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
4. run `npm install`
5. Run `npm run server`
6. Open `http://localhost:3000` in your browser
