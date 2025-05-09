// Define environment types
export enum EnvironmentType {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

// Environment configuration
export const environment = {
  current: process.env.NODE_ENV || EnvironmentType.DEVELOPMENT,
  isDevelopment: process.env.NODE_ENV === EnvironmentType.DEVELOPMENT || !process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === EnvironmentType.PRODUCTION,
  isTest: process.env.NODE_ENV === EnvironmentType.TEST,
};