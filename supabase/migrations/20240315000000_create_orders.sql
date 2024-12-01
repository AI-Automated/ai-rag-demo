CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL,
  expected_delivery TIMESTAMP WITH TIME ZONE NOT NULL,
  shipping_updates JSONB DEFAULT '[]',
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL
);

-- Insert mock order data
INSERT INTO orders (
  tracking_number,
  user_id,
  order_date,
  status,
  expected_delivery,
  shipping_updates,
  items,
  shipping_address
) VALUES (
  'TGP1234567890US',
  'mock-user-id',
  '2024-03-14T10:30:00Z',
  'In Transit',
  '2024-03-18T17:00:00Z',
  '[
    {"date": "2024-03-14T10:30:00Z", "status": "Order Confirmed", "location": "Online"},
    {"date": "2024-03-14T15:45:00Z", "status": "Processing", "location": "TechGear Warehouse"},
    {"date": "2024-03-15T08:20:00Z", "status": "Shipped", "location": "Distribution Center"},
    {"date": "2024-03-15T14:30:00Z", "status": "In Transit", "location": "Regional Sorting Facility"}
  ]',
  '[
    {"id": 1, "name": "TechPro X1 Smartphone", "quantity": 1, "price": 799},
    {"id": 2, "name": "SoundWave Pro Earbuds", "quantity": 1, "price": 199}
  ]',
  '{
    "name": "John Doe",
    "street": "123 Tech Street",
    "city": "Silicon Valley",
    "state": "CA",
    "zipCode": "94025",
    "country": "United States"
  }'
);