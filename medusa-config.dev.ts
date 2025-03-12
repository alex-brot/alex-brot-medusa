import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/my-payment",
            id: "my-payment",
            options: {
              // provider options...
              apiKey: "...",
            },
          },
        ],
      },
    },
    {
      resolve: "./src/modules/allergen-module",
    },
    {
      resolve: "./src/modules/weekly-offers-module",
    },
    {
      resolve: "./src/modules/pos-module",
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
            },
          },
        ],
      },
    },

  ],
  admin: {
    vite: () => {
      return {
        optimizeDeps: {
          include: ["@emotion/react", "@mui/material", "react-table"],
        },
      };
    },
  },
  plugins: [
    {
      resolve: "@rsc-labs/medusa-documents-v2",
      options: {
      },
    }
  ]
});
