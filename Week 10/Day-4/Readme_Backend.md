Run Server: npm start

Local Swagger Url: http://localhost:5000/api-docs

Command to allow vercel to access mongo-db atlas: vercel env add MONGO_URI

Live Link(Swagger UI) : https://abdullah-week3-day2-task1.vercel.app/api-docs/

#Learning: Resolved the issue of Serverless function crash upon deploying backend. Learned about mongo DB network access restrictions.

# Week10-Day4 Backend Testing

Github URL:https://github.com/Netixsol-Innovator-Internship/Abdullah-Jabbar/tree/main/Week%203/Day-2/Task-1

This project uses Jest for unit and end-to-end testing.

## Running Tests

- Run all tests: `npm test`
- Run tests with coverage: `npm run test:coverage`

## Test Structure

- **Unit Tests**: Located in `tests/unit/`, covering individual modules like middleware.
- **End-to-End Tests**: Located in `tests/e2e/`, testing full API flows with in-memory database.

## Coverage

Coverage reports are generated in the `coverage/` directory after running `npm run test:coverage`.
![Test Coverage]({8F13CA96-6B33-4701-A07C-41903CAFC783}.png)