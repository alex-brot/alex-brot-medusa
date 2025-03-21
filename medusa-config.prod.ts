import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  admin: {
    vite: () => {
      return {
        optimizeDeps: {
          include: ["@emotion/react", "@mui/material", "react-table"],
        },
        server: {
          allowedHosts: [".medusa.alex-brot.stenz.dev"], // replace ".medusa-server-testing.com" with ".yourdomain.com"
        fs: {
      	    allow: ['..'],
    	  },
        },
      };
    },
  },
  projectConfig: {
    //redisUrl: process.env.REDIS_URL,
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
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
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
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
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
            },
          },
        ],
      },
    },
  ],
  plugins: [
    {
      resolve: "@rsc-labs/medusa-documents-v2",
      options: {
      },
    }
  ]
});
