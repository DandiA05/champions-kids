-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  banner_url TEXT,
  description TEXT,
  event_date DATE,
  documentation_urls JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups by event_date
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);

-- Insert sample events data
INSERT INTO events (title, banner_url, description, event_date, documentation_urls)
VALUES 
  (
    'Champions Kids Tournament 2024', 
    'https://res.cloudinary.com/demo/image/upload/v1631234567/sample.jpg', 
    'Turnamen akbar tahunan Champions Kids untuk semua kategori umur. Mari tunjukkan bakat dan sportivitas!', 
    '2024-06-15', 
    '["https://res.cloudinary.com/demo/image/upload/v1631234568/sample.jpg", "https://res.cloudinary.com/demo/image/upload/v1631234569/sample.jpg"]'
  ),
  (
    'Weekend Training Camp with Coach Surya', 
    'https://res.cloudinary.com/demo/image/upload/v1631234570/sample.jpg', 
    'Sesi latihan intensif akhir pekan khusus untuk mengasah teknik dasar dan strategi permainan.', 
    '2024-03-20', 
    '["https://res.cloudinary.com/demo/image/upload/v1631234571/sample.jpg"]'
  ),
  (
    'Parents and Kids Fun Match', 
    'https://res.cloudinary.com/demo/image/upload/v1631234572/sample.jpg', 
    'Acara kekeluargaan seru di mana orang tua dan anak bermain sepak bola bersama dalam suasana kegembiraan.', 
    '2024-05-10', 
    '[]'
  );
