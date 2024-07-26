import { Config } from "jest";
const config: Config = {
  testEnvironment: "node",
  transform: {
    "^.+.(t|j)sx?$": ["@swc/jest",{}],
  },
  setupFiles: [
    "<rootDir>/jest.setup.ts"
  ]
};

export default config;