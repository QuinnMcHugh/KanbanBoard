import type { Decorator } from "@storybook/react-vite";

/**
 * Stubs window.fetch for the duration of a story's render, resolving each URL
 * to a canned JSON response. Intentionally lightweight — no service worker,
 * no request matching beyond an exact URL match — this is for visually
 * showcasing components, not testing real request/response behavior.
 *
 * Unmapped URLs get a 404-style Response plus a console.warn, so a missing
 * entry in a story's mock map is obvious in the browser console rather than
 * silently rendering blank.
 */
function resolveUrl(input: RequestInfo | URL): string {
    if (typeof input === "string") return input;
    if (input instanceof URL) return input.toString();
    return input.url;
}

export function withMockFetch(responses: Record<string, unknown>): Decorator {
    return (Story) => {
        window.fetch = (input: RequestInfo | URL) => {
            const url = resolveUrl(input);

            if (!(url in responses)) {
                console.warn(
                    `[withMockFetch] No mock response registered for "${url}". Add it to the story's withMockFetch({...}) map.`,
                );
                return Promise.resolve(
                    new Response(JSON.stringify({ error: "Not mocked." }), {
                        status: 404,
                    }),
                );
            }

            return Promise.resolve(
                new Response(JSON.stringify(responses[url])),
            );
        };

        return <Story />;
    };
}
