/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** FormSubmit AJAX endpoint for the contact form, e.g. https://formsubmit.co/ajax/you@example.com */
  readonly VITE_FORMSUBMIT_ENDPOINT?: string
  /** Password for the hidden recipe admin page. Bundled client-side; obscurity only. */
  readonly VITE_ADMIN_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
