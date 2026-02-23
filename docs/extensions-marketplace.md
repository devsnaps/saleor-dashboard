# Self-hosted Extensions Marketplace

This dashboard branch can display Explore cards from a custom API via `EXTENSIONS_API_URL`.

## 1. Run the sample API

```bash
node scripts/extensions-api-server.cjs
```

Optional env vars:

- `EXTENSIONS_API_PORT` (default: `3011`)
- `EXTENSIONS_CATALOG_PATH` (default: `scripts/extensions-api-catalog.sample.json`)

## 2. Point dashboard env to your API

```env
EXTENSIONS_API_URL=http://localhost:3011/api/v1/extensions
ALLOW_SELF_HOSTED_EXTENSIONS_INSTALL=true
```

## 3. Ensure install flow is enabled

Set one of:

- `IS_CLOUD_INSTANCE=true`
- `ALLOW_SELF_HOSTED_EXTENSIONS_INSTALL=true`

When enabled, clicking `Install` in Explore opens `/extensions/app/install?manifestUrl=...` and uses Saleor GraphQL mutations (`appFetchManifest`, `appInstall`).

## API shape expected by Explore

```json
{
  "extensionCategories": [
    {
      "id": "payments",
      "name": { "en": "Payments" },
      "extensions": [
        {
          "id": "saleor.app.payment.stripe",
          "type": "APP",
          "kind": "OFFICIAL",
          "name": { "en": "Stripe" },
          "description": { "en": "..." },
          "logo": {
            "light": { "source": "https://..." },
            "dark": { "source": "https://..." }
          },
          "manifestUrl": "https://.../api/manifest",
          "repositoryUrl": "https://github.com/..."
        }
      ]
    }
  ]
}
```

Category names should map to Explore groups: `Payments`, `Taxes`, `CMS`, `Automation`.
