# CivicCast

CivicCast is a platform for real-time civic engagement, allowing users to interact with live polls, view analytics, and participate in ongoing discussions. The project leverages modern web technologies to provide instant updates and a seamless user experience.

## Features

- **Live Polls**: Users can participate in polls and see results update in real time.
- **Real-Time Dashboard**: Administrators and users have access to a live dashboard, reflecting poll changes and analytics instantly.
- **User Authentication**: Secure access to features using session-based authentication.
- **Analytics & Insights**: Visualize poll performance and user engagement.

## Tech Stack

- **Next.js**: Server-side rendered React framework
- **Server-Sent Events (SSE)**: For real-time updates
- **Redux**: State management
- **Material UI**: UI components
- **Authentication**: Via NextAuth
- **Custom Backend Services**: For poll, vote, like, and notification management

## Folder Structure

```
CivicCast/
├── .gitignore
├── .husky/
│   └── pre-commit
├── .npmrc
├── .prettierrc.js
├── .vscode/
│   └── settings.json
├── README.md
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── src/
    ├── app/
    ├── components/
    ├── constant/
    ├── containers/
    ├── hooks/
    ├── lib/
    ├── middleware.js
    ├── prisma/
    └── services/
```

- Top-level files: configuration, README, and package files.
- `.husky/`: Git hooks for code quality checks.
- `.vscode/`: Editor settings.
- `public/`: Static assets (SVGs).
- `src/`: Main source code.
  - `app/`: Application routes and API endpoints.
  - `components/`: React UI components.
  - `constant/`: Constant values/configs.
  - `containers/`: Component containers.
  - `hooks/`: React hooks.
  - `lib/`: Shared libraries (e.g., SSE logic, auth).
  - `prisma/`: Database schema/config.
  - `services/`: Business logic and Redux.
  - `middleware.js`: Middleware logic.

## Real-Time Updates (SSE Implementation)

CivicCast implements real-time updates using **Server-Sent Events (SSE)**, enabling the server to push updates to the client as they happen. This is used both for poll results and for dashboard updates.

### How SSE is Implemented

#### 1. API Endpoints for SSE Streams

- **Dashboard Updates**:
  The endpoint `/api/dashboard/live` streams live updates to the dashboard.
  ([dashboard SSE code](https://github.com/j-aloko/CivicCast/blob/main/src/app/api/dashboard/live/route.js))
- **Poll Updates**:
  Each poll has its own SSE endpoint at `/api/polls/[id]/live`, providing real-time updates for that specific poll.
  ([poll SSE code](https://github.com/j-aloko/CivicCast/blob/main/src/app/api/polls/%5Bid%5D/live/route.js))

Both endpoints use the `ReadableStream` API to stream data and set appropriate headers:

```js
return new Response(stream, {
  headers: {
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
  },
});
```

#### 2. Stream Management

- The file [`src/lib/utils/sse-manager.js`](https://github.com/j-aloko/CivicCast/blob/main/src/lib/utils/sse-manager.js) manages active SSE streams using JavaScript Maps and Sets.
- Functions like `registerStream`, `unregisterStream`, and `registerDashboard` track and clean up SSE connections as clients connect/disconnect or abort requests.
- The server periodically sends "heartbeat" messages to keep connections alive and immediately broadcasts updates when poll data changes.

#### 3. Broadcasting Updates

- When a poll is updated (e.g., a vote is cast), the server calls `broadcastToPoll(pollId, triggeringUserId)` to send new results to all connected clients for that poll.
- For dashboard updates, `broadcastToDashboard()` broadcasts the latest poll data to all dashboard clients.

Messages are encoded and sent according to the SSE protocol:

```js
const message = `data: ${JSON.stringify(payload)}\n\n`;
ctrl.enqueue(new TextEncoder().encode(message));
```

#### 4. Client-Side SSE

- On the frontend, the [`RealtimeService`](https://github.com/j-aloko/CivicCast/blob/main/src/lib/utils/realtime-service.js) class manages EventSource connections to the appropriate endpoints.
- For polls: `new EventSource('/api/polls/[id]/live')`
- For the dashboard: `new EventSource('/api/dashboard/live')`
- The service handles reconnections, message processing, and dispatches updates to the Redux store.

#### 5. Security

- SSE endpoints require an authenticated session. If a user is not authenticated, the API returns a 401 Unauthorized response.

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/j-aloko/CivicCast.git
   cd CivicCast
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Configure your `.env` file as needed for authentication and database access.

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open in your browser**
   - Visit [http://localhost:3000](http://localhost:3000)

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

---
