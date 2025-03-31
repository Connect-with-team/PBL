const IndexFile = await Deno.readTextFile("./code/index.html");

// Store connected WebSocket clients by chat room
interface ChatMessage {
  roomId: string;
  text: string;
  userId: string;
  location: string;
  timestamp: number;
}

const chatRooms = new Map<string, Set<WebSocket>>();

// Function to broadcast messages to all clients in a room
function broadcastToRoom(roomId: string, message: ChatMessage) {
  const room = chatRooms.get(roomId);
  if (!room) return;

  const messageStr = JSON.stringify(message);
  
  // Send to all connected clients in the room
  for (const client of room) {
    try {
      client.send(messageStr);
    } catch (err) {
      console.error("WebSocket send error:", err);
    }
  }
}

Deno.serve({
    port: 8000,
}, async (req: Request) => {
    const url = new URL(req.url);
    const path = url.pathname;

    // Handle WebSocket connections for chat
    if (path === "/ws/chat") {
      const { socket, response } = Deno.upgradeWebSocket(req);
      
      let userRoomId: string | null = null;

      socket.onopen = () => {
        console.log("WebSocket connection opened");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle chat room joining
          if (data.type === "join") {
            userRoomId = data.roomId;
            
            // Create room if it doesn't exist
            if (!chatRooms.has(userRoomId)) {
              chatRooms.set(userRoomId, new Set());
            }
            
            // Add user to room
            chatRooms.get(userRoomId)?.add(socket);
            console.log(`User joined room ${userRoomId}`);
            
            // Send confirmation
            socket.send(JSON.stringify({ 
              type: "system", 
              text: "Connected to chat room",
              roomId: userRoomId 
            }));
          }
          
          // Handle explicit leave room
          if (data.type === "leave" && userRoomId) {
            if (chatRooms.has(userRoomId)) {
              chatRooms.get(userRoomId)?.delete(socket);
              console.log(`User left room ${userRoomId}`);
            }
            userRoomId = null;
          }
          
          // Handle chat messages
          if (data.type === "message" && userRoomId) {
            const message: ChatMessage = {
              roomId: userRoomId,
              text: data.text,
              userId: data.userId,
              location: data.location,
              timestamp: Date.now()
            };
            
            broadcastToRoom(userRoomId, message);
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      socket.onclose = () => {
        if (userRoomId && chatRooms.has(userRoomId)) {
          chatRooms.get(userRoomId)?.delete(socket);
          console.log(`User left room ${userRoomId}`);
        }
      };

      return response;
    }

    if (path === "/") {
        return Response.redirect(new URL("/code/index.html", req.url), 302);
    }

    if (!path.startsWith("/code/")) {
        return Response.redirect(new URL("/code/index.html", req.url), 302);
    }

    // Serve static files from the /code directory
    if (path.startsWith("/code/")) {
        try {
            const filePath = "." + path;
            const content = await Deno.readTextFile(filePath);

            // Set appropriate content type based on file extension
            const extension = path.split(".").pop() || "";
            const contentType = {
                "html": "text/html",
                "css": "text/css",
                "js": "text/javascript",
                "png": "image/png",
                "jpg": "image/jpeg",
                "jpeg": "image/jpeg",
                "gif": "image/gif",
                "svg": "image/svg+xml",
            }[extension] || "text/plain";

            return new Response(content, {
                headers: {
                    "content-type": contentType,
                },
            });
        } catch (error) {
            console.error(`Error serving ${path}:`, error);
            return new Response("File not found", { status: 404 });
        }
    }

    // Default to serving index.html
    return new Response(IndexFile, {
        headers: {
            "content-type": "text/html",
        },
    });
});
