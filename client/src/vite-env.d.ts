/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Base URL of the API, e.g. "https://api.example.com". Unset in dev — relative
     *  paths are used instead, proxied by Vite's dev server (see vite.config.ts). */
    readonly VITE_API_URL?: string
}
