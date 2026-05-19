/**
 * Service helper for talking to René AI Concierge Backend.
 * Supports optional AbortSignal for timeout handling.
 */
export async function sendReneMessage(message: string, signal?: AbortSignal): Promise<string> {
  const endpoint = "https://whodisbruhhh-rene-ai.hf.space/chat";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
      signal, // Pass AbortSignal for timeout support
    });

    if (!response.ok) {
      throw new Error(`René API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || "Réne is temporarily unavailable right now.";
  } catch (error) {
    console.error("Failed to receive response from René AI backend:", error);
    throw error;
  }
}
