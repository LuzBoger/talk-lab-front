import { onBeforeUnmount } from 'vue';

let eventSource: EventSource | null = null;

export function useMercure(
  conversationId: number,
  onMessageReceived: (data: any) => void
) {
  const mercureUrl = import.meta.env.VITE_MERCURE_URL;
  const jwtToken = import.meta.env.VITE_MERCURE_JWT;

  if (!mercureUrl) {
    console.error('VITE_MERCURE_URL is not defined in environment variables.');
    return;
  }

  const url = new URL(mercureUrl);
  // Append the topic and the JWT token as query parameters
  url.searchParams.append('topic', `${import.meta.env.VITE_MERCURE_TOPIC}${conversationId}`);
  url.searchParams.append('Authorization', `Bearer ${jwtToken}`);

  // Close any existing EventSource connection before creating a new one
  if (eventSource) {
    eventSource.close();
  }

  eventSource = new EventSource(url.toString(), {
    withCredentials: true,
  });

  if (eventSource) {
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageReceived(data);
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    };
  }

  eventSource.onerror = (error) => {
    console.error('Mercure error:', error);
    if (error instanceof Event) {
      console.error('Error details:', {
        status: (error as any).status,
        statusText: (error as any).statusText,
        type: (error as any).type,
      });
    } else {
      console.error('Unexpected error:', error);
    }

    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };

  onBeforeUnmount(() => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  });
}
