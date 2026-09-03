export interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
}

export interface Configuration {
  database: DatabaseConfig;
  jwt: JwtConfig;
  app: AppConfig;
}

export function configuration(): Configuration {
  const nodeEnv = process.env.NODE_ENV || 'development';

  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const username = process.env.DB_USERNAME || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgres';
  const database = process.env.DB_NAME || 'janora_db';

  // URL-encode username and password to handle special characters
  const encodedUsername = encodeURIComponent(username);
  const encodedPassword = encodeURIComponent(password);

  const databaseUrl = process.env.DATABASE_URL ||
    `postgresql://${encodedUsername}:${encodedPassword}@${host}:${port}/${database}`;

  // Ensure DATABASE_URL is set for Prisma
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = databaseUrl;
  }

  return {
    database: {
      url: databaseUrl,
      host,
      port: parseInt(port, 10),
      username,
      password,
      database,
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      refreshSecret:
        process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key-change-in-production',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    app: {
      port: parseInt(process.env.PORT || '3000', 10),
      nodeEnv,
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },
  };
}
