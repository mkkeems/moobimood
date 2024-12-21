function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const config = {
  GOOGLE_CLIENT_ID: getEnvVariable("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnvVariable("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REDIRECT_URI: getEnvVariable("GOOGLE_REDIRECT_URI"),
  API_URL: getEnvVariable("NEXT_PUBLIC_API_URL"),
  SESSION_SECRET: getEnvVariable("SESSION_SECRET"),
  DATABASE_URL: getEnvVariable("DATABASE_URL"),
  NODE_ENV: process.env.NODE_ENV,
};
