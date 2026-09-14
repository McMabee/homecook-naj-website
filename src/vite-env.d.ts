/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** FormSubmit AJAX endpoint for the contact form, e.g. https://formsubmit.co/ajax/you@example.com */
  readonly VITE_FORMSUBMIT_ENDPOINT?: string
  /** Supabase project URL, e.g. https://abcdefghijkl.supabase.co */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase publishable key (sb_publishable_…). Safe in the browser; row-level security guards writes. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
