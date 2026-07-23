import { NextRequest } from "next/server";
import { uploadEvents } from "@/lib/emitter";
import { MediaItem } from "@/utils/typescript/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;

  let interval: NodeJS.Timeout;

  const responseStream = new ReadableStream({
    start(controller) {
      // 1. Define the listener callback
      const listener = (data: { eventId: string; mediaItem: MediaItem }) => {
        if (data.eventId === eventId) {
          try {
            controller.enqueue(`data: ${JSON.stringify(data.mediaItem)}\n\n`);
          } catch (e: unknown) {
            console.error("Error enqueuing message:", e);
          }
        }
      };

      // 2. Register the listener
      uploadEvents.on("upload", listener);

      // 3. Keep-alive interval (runs every 15s) to avoid gateway timeouts
      interval = setInterval(() => {
        try {
          controller.enqueue(":keep-alive\n\n");
        } catch (e: unknown) {
          clearInterval(interval);
        }
      }, 15000);

      // 4. Handle client disconnect / request abort
      request.signal.addEventListener("abort", () => {
        uploadEvents.off("upload", listener);
        clearInterval(interval);
        try {
          controller.close();
        } catch (e) {
          // Stream might already be closed
        }
      });
    },
    cancel() {
      clearInterval(interval);
    }
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
