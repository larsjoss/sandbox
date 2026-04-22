function require_env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const config = {
  PORT: parseInt(process.env.PORT ?? '3001', 10),
  DATABASE_URL: require_env('DATABASE_URL'),
  JWT_SECRET: require_env('JWT_SECRET'),
  JWT_EXPIRES_IN: '7d' as const,
  ANTHROPIC_API_KEY: require_env('ANTHROPIC_API_KEY'),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
};
