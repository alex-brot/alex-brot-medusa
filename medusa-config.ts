import {ConfigModule} from "@medusajs/types";
import { resolve } from 'path';

const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
const ending = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
console.log(process.env.NODE_ENV)
const configPath = resolve(__dirname, `./medusa-config.${env}.${ending}`);

const config: ConfigModule = require(configPath).default;
export default config;