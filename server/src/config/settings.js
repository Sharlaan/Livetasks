export const common = {
  port: Number(process.env.PORT) || 3210
}

export const socket = {
  port: 8000
}

export const database = {
  host: 'localhost',
  database: 'livetasks',
  user: 'postgres',
  password: 'postgres',
  port: 5432,
  ssl: false
}

export const test = {
  host: 'localhost',
  port: 5432,
  database: 'livetasks_test',
  user: 'postgres',
  password: 'postgres'
}
