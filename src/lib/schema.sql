-- Create blogs table if it doesn't exist
CREATE TABLE IF NOT EXISTS blogs (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  title_part1 VARCHAR(255) NOT NULL,
  title_part2 VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  read_time VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500) NOT NULL,
  color VARCHAR(20) NOT NULL CHECK (color IN ('blue', 'pink', 'green')),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);

