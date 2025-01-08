import {ConfigModule} from "@medusajs/types";


let config: ConfigModule

if (process.env.NODE_ENV === 'production') {
  config = require('./medusa-config.prod.ts').default;
} else {
  config = require('./medusa-config.dev.ts').default;
}

export default config;