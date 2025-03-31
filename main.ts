const IndexFile = await Deno.readTextFile("./code/index.html");
Deno.serve({
    port: 8000,
}, async (req: Request) => {
    const url = new URL(req.url);
    const path = url.pathname;

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
