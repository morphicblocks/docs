interface ImportMetaEnv {
  readonly PUBLIC_SITE_NAME?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_SITE_DESCRIPTION?: string;
  readonly PUBLIC_NPM_PACKAGE?: string;
  readonly PUBLIC_NPM_URL?: string;
  readonly PUBLIC_GITHUB_URL?: string;
  readonly PUBLIC_LANDING_URL?: string;
  readonly PUBLIC_PLAYGROUND_URL?: string;
  readonly PUBLIC_UNIVERSITY?: string;
  readonly PUBLIC_UNIVERSITY_URL?: string;
  readonly PUBLIC_IMPRINT_URL?: string;
  readonly PUBLIC_PRIVACY_URL?: string;
  readonly PUBLIC_DISCLAIMER_URL?: string;
  readonly PUBLIC_IMPRINT_URL_EN?: string;
  readonly PUBLIC_PRIVACY_URL_EN?: string;
  readonly PUBLIC_DISCLAIMER_URL_EN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
