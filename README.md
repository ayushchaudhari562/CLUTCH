# CLUTCH

## Platform Architecture and Technical Specification

CLUTCH is a decentralized, peer-to-peer campus learning network and community application built for students. It facilitates academic exchange, peer matchmaking, real-time audio/visual communication, collaborative vector whiteboards, and localized discussions restricted by college affiliation.

---

## 1. System Architecture

The software architecture consists of a client-server paradigm with real-time bidirectional messaging and third-party authentication integration.

```mermaid
graph TD
    User([Client Application]) -->|Session & Token Exchange| Clerk[Clerk Authentication Service]
    User -->|RESTful Operations| Express[Express.js Application Server]
    User -->|Bidirectional Event Sync| SocketIO[Socket.io Server]
    Express -->|Prisma Client Queries| PostgreSQL[(PostgreSQL Database)]
    SocketIO -->|Signaling & State Propagation| User
```

---

## 2. Core Functional Subsystems

### 2.1 Identity Management and Institutional Affiliation Onboarding
* **Authentication Provider:** User registration and session state are managed via Clerk. During registration, the client token is verified on the backend, and user state is synchronized.
* **Institutional Mapping Database:** The system references a collection of Indian academic institutions. This dataset is initialized using the `indian-colleges` schema registry and seeded via database migrations.
* **Affiliation Resolution:** During onboarding, users complete a case-insensitive query lookup against the `Colleges` table, binding their Postgres `User` record to a specific `collegeId` and `collegeName`.

### 2.2 Peer-to-Peer Matchmaking (Study Swap Engine)
* **Match Definition:** Users declare learning assets they possess ("offers") and competencies they seek ("needs"), categorized under either generalized skills or Data Structures and Algorithms (DSA).
* **Asynchronous Match Propagation:** The matching engine uses Socket.io to route direct pairing requests. When a user initiates a match:
  1. A `request-match` socket event is dispatched to the target socket ID containing the requester's metadata.
  2. The target client displays a modal allowing prompt acceptance or rejection of the matchmaking request.
  3. Acceptance triggers an `accept-match` socket event on the server, generating a unique cryptographically pseudorandom room ID (`room${Date.now()}`) and redirecting both clients to the collaborative workspace route `/study-room?room=<roomId>`.

### 2.3 Real-Time Collaborative Study Room
* **Collaborative Vector Workspace:** Integration of `@excalidraw/excalidraw` for canvas operations. All structural operations (shape addition, stroke adjustments, text modifications) generate a canvas change payload. This payload is intercepted and broadcasted dynamically via socket events (`excalidraw-update`) to synchronize client views without local DB persistence.
* **WebRTC Signaling and Media Streaming:** Direct peer-to-peer communication is established using `RTCPeerConnection` with the following pipeline:
  1. The client queries the `stun:stun.l.google.com:19302` STUN server to discover its public-facing IP and port configurations (ICE Candidates).
  2. Media streams (local camera and microphone input) are resolved via the `navigator.mediaDevices.getUserMedia` API.
  3. Web socket signaling coordinates the exchange of session descriptions (SDP Offer/Answer) and ICE candidates using signaling paths: `webrtc-offer`, `webrtc-answer`, and `webrtc-ice-candidate`.
* **Dynamic Layout Engine:** A resizer mechanism monitors workspace pointer movement, recalculating relative flexbox container dimensions to allow resizing of the whiteboard canvas relative to the media/chat panel.

### 2.4 Anonymous Campus Feed and Nested Discussions
* **Affiliation Restrictive Querying:** The backend filters social feed posts based on the `collegeId` attribute of the logged-in user, restricting the visibility of posts to members of the same institution.
* **Binary Media Processing:** Uploaded post images are handled via `Multer` disk storage configuration, writing incoming streams directly to `/uploads` on the server file system and returning local URLs.
* **Hierarchical Tree Commenting:** Comments are represented in the relational database as an adjacency list. The `Comment` schema maintains a self-referencing relationship:
  * A comment may optional link to a `parentId`.
  * The API fetches comments in linear fashion and processes the result set into a recursive JSON tree, clustering replies under parent objects.
* **Pseudonymization Algorithm:** To ensure user privacy, usernames are obfuscated in comment sections. A deterministic function evaluates user ID integers against a modulo constraint mapping to a static array of animal handles:
  $$\text{pseudonym} = \text{animals}[\text{userId} \pmod{\text{len}(\text{animals})}] + \text{userId}$$
* **Engagement Analytics Leaderboard:** An analytics pipeline evaluates post counts per college using a raw SQL aggregation query (`$queryRaw`) mapping the counts to rank active institutions:
  ```sql
  SELECT u."collegeId", COUNT(p.id) as "postCount"
  FROM "Post" p
  JOIN "User" u ON p."authorId" = u.id
  WHERE u."collegeId" IS NOT NULL
  GROUP BY u."collegeId"
  ORDER BY "postCount" DESC
  LIMIT 5
  ```

---

## 3. Technology Stack and Dependencies

| Layer | Dependencies | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, TailwindCSS (v4), React Router Dom (v7), `@clerk/clerk-react` | Client-side interface rendering, application routing, and authentication wrappers. |
| **Real-time Engine**| Socket.io-client, RTCPeerConnection (WebRTC), `@excalidraw/excalidraw` | Event-driven socket connections, media negotiation, and canvas serialization. |
| **Backend API** | Node.js, Express 5, Socket.io, Multer, `xlsx` | HTTP interface routing, media binary uploads, and Excel parsing. |
| **Database Engine** | PostgreSQL, Prisma Client | Relational data persistence, schema modeling, and raw analytical querying. |

---

## 4. Directory Layout

```
CLUTCH/
├── backend/                  # Application server and socket handlers
│   ├── college_name/         # Contains raw institutional registry (Excel sheets)
│   ├── prisma/               # Database migration files and client schema specifications
│   ├── src/
│   │   ├── controllers/      # Route logic for relational models (Posts, nested comments)
│   │   ├── middleware/       # Middleware functions (Binary file parsing, auth helpers)
│   │   ├── routes/           # REST endpoints mapping client actions
│   │   ├── services/         # Auxiliary helpers and algorithms
│   │   ├── sockets/          # Socket.io connection and message namespaces
│   │   ├── app.js            # Express application instance declaration
│   │   └── server.js         # Entrypoint binding Express app and socket server to TCP ports
│   ├── seed.js               # Database seeding script mapping Excel rows to PostgreSQL
│   └── package.json
│
├── clutch-client/            # Client interface application code
│   ├── public/
│   ├── src/
│   │   ├── api/              # API interface abstractions and onboarding views
│   │   ├── components/       # Core UI component classes (Navigation, study room layout)
│   │   ├── hooks/            # Custom hooks (WebRTC peer creation, state listeners)
│   │   ├── pages/            # View managers (Social feed, matchmaking, virtual room)
│   │   ├── socket/           # WebSocket socket.io client initialization
│   │   ├── App.jsx           # Client component tree and route configuration
│   │   └── main.jsx          # React entrypoint mounting DOM node
│   └── package.json
│
├── package.json              # Monorepo task configurations
└── README.md
```

---

## 5. Relational Model Schema Specification

The relational database is constructed in PostgreSQL via the following Prisma model definition:

```prisma
model User {
  id            Int       @id @default(autoincrement())
  clerkId       String?   @unique
  username      String    @unique
  email         String    @unique
  passwordHash  String
  collegeName   String? 
  collegeId     Int?      
  createdAt     DateTime  @default(now())
  posts         Post[]
  likes         Like[]
  comments      Comment[]
}

model Post {
  id         Int        @id @default(autoincrement())
  title      String
  content    String?
  imageUrl   String?
  createdAt  DateTime   @default(now())
  authorId   Int
  author     User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  likes      Like[]
  comments   Comment[]
}

model Comment {
  id        Int       @id @default(autoincrement())
  postId    Int
  userId    Int
  content   String
  parentId  Int?      
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   Comment[] @relation("CommentReplies")
  createdAt DateTime  @default(now())
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Colleges {
   id       Int     @id
   name     String  @unique
}
```

---

## 6. Real-Time Socket Event Protocol

Communication over the WebSocket interface executes under the following specific contract:

| Event Identifier | Data Origin | Payload Signature | Description |
| :--- | :--- | :--- | :--- |
| `join-room` | Client ➔ Server | `roomId: string` | Instructs the server to subscribe the socket to the defined room channel. |
| `send-message` | Client ➔ Server | `{ roomId: string, text: string, sender: string }` | Relays an instant chat message to all connected clients in the room. |
| `request-match` | Client ➔ Server | `{ targetSocketId: string, requesterSocketId: string, requesterName: string }` | Forwards a matchmaking invitation to the specific target socket. |
| `accept-match` | Client ➔ Server | `{ targetSocketId: string, requesterSocketId: string }` | Triggers unique channel instantiation and routes target and host to the workspace. |
| `excalidraw-update`| Client ➔ Server | `{ roomId: string, elements: any[] }` | Broadcasts drawing vector array delta updates to other room participants. |
| `webrtc-offer` | Bidirectional | `{ roomId: string, offer: RTCSessionDescriptionInit, targetSocketId?: string }` | Initiates WebRTC handshaking by sending the caller's Session Description Protocol parameters. |
| `webrtc-answer` | Bidirectional | `{ roomId: string, answer: RTCSessionDescriptionInit }` | Complete WebRTC handshaking by returning the receiver's Session Description Protocol parameters. |
| `webrtc-ice-candidate`| Bidirectional| `{ roomId: string, candidate: RTCIceCandidateInit }` | Disseminates discovered network routing pathways to negotiate network traversal. |
| `reject-call` | Client ➔ Server | `{ targetSocketId: string }` | Signal that the targeted peer has rejected the incoming stream negotiation. |
| `call-rejected` | Server ➔ Client | (Empty) | Dispatched to caller indicating session negotiation termination. |

---

## 7. Deployment and Initialization Setup

### 7.1 System Requirements
* Node.js runtime environment (version >= 18.0.0)
* npm packager (version >= 9.0.0)
* PostgreSQL instance

### 7.2 Database Setup and Migration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the `.env` configuration file inside `backend/`:
   ```env
   DATABASE_URL="postgresql://<db_user>:<db_password>@<db_host>:<db_port>/<db_name>?schema=public"
   ```
4. Perform Prisma migration to update PostgreSQL database structure:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed database with the institutional registry via Excel sheet input parsing:
   ```bash
   node seed.js
   ```

### 7.3 Client Application Setup
1. Navigate to the client directory:
   ```bash
   cd ../clutch-client
   ```
2. Run package installation:
   ```bash
   npm install
   ```
3. Initialize the client environment configuration file `.env` inside `clutch-client/`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   ```

### 7.4 Execution Commands
Run the development servers concurrently in separate terminals:

* **Backend API and WebSocket Instance:**
  ```bash
  cd backend
  npm run dev
  ```
* **Frontend Vite Service:**
  ```bash
  cd clutch-client
  npm run dev
  ```

Upon active execution, navigate to `http://localhost:5173`. Ensure authorization steps are completed to allow access to authenticated API endpoints.