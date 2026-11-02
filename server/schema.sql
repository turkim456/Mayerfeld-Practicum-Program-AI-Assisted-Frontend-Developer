CREATE TABLE IF NOT EXISTS dishes (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('starters', 'main-dishes', 'desserts')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image TEXT NOT NULL,
  alt TEXT NOT NULL,
  width INTEGER NOT NULL CHECK (width > 0),
  height INTEGER NOT NULL CHECK (height > 0)
);
