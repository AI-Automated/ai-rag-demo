-- Create a table for our customer service information
CREATE TABLE customer_service_info (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL
);

-- Enable full text search
ALTER TABLE customer_service_info ADD COLUMN fts tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;
CREATE INDEX customer_service_info_fts ON customer_service_info USING GIN (fts);

-- Insert some mock data
INSERT INTO customer_service_info (content) VALUES
('Our return policy allows returns within 30 days of purchase for a full refund.'),
('We offer free shipping on all orders over $50.'),
('Our customer service hours are Monday to Friday, 9 AM to 5 PM EST.'),
('To track your order, please use the tracking number provided in your shipping confirmation email.'),
('We offer a 1-year warranty on all electronic products.'),
('Our loyalty program gives you 1 point for every dollar spent, which can be redeemed for discounts on future purchases.'),
('We have physical stores in New York, Los Angeles, and Chicago.'),
('All our products are cruelty-free and not tested on animals.'),
('We offer gift wrapping services for an additional $5 per item.'),
('Our website uses 256-bit SSL encryption to ensure your personal and payment information is secure.');

