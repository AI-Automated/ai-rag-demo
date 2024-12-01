-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop the existing table
DROP TABLE IF EXISTS customer_service_info;

-- Create a new table for our enhanced customer service information
CREATE TABLE customer_service_info (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536)
);

-- Enable full text search
CREATE INDEX customer_service_info_fts ON customer_service_info USING GIN (to_tsvector('english', content));

-- Insert mock data for TechGear Pro
INSERT INTO customer_service_info (category, content) VALUES
('Company', 'TechGear Pro is a leading online electronics retailer, offering a wide range of high-quality gadgets and accessories. We pride ourselves on excellent customer service and competitive prices.'),
('Shipping', 'TechGear Pro offers free standard shipping on all orders over $50. Express shipping is available for an additional fee. Most orders are processed and shipped within 1-2 business days.'),
('Returns', 'TechGear Pro has a 30-day return policy for most items. Products must be in original condition with all accessories. Refunds are processed within 5-7 business days after we receive the return.'),
('Product', 'The TechPro X1 Smartphone is our flagship device, featuring a 6.5" OLED display, 5G capability, and an AI-powered triple-lens camera system. It comes with 128GB or 256GB storage options.'),
('Product', 'The SoundWave Pro Wireless Earbuds offer premium sound quality with active noise cancellation. They have a battery life of up to 8 hours, with an additional 24 hours from the charging case.'),
('Product', 'The PowerMax 20000 is a high-capacity portable charger compatible with most smartphones and tablets. It features fast charging technology and can charge up to three devices simultaneously.'),
('Warranty', 'All TechGear Pro products come with a standard 1-year limited warranty. Extended warranty options are available for purchase, covering accidental damage and extending coverage for up to 3 years.'),
('Support', 'TechGear Pro offers 24/7 customer support via chat and email. Phone support is available Monday to Friday, 9 AM to 8 PM EST. For technical issues, we also provide remote troubleshooting sessions by appointment.'),
('Loyalty Program', 'Join TechGear Pro Rewards to earn points on every purchase. Every $1 spent equals 1 point. Accumulate points to redeem for discounts, free accessories, or even the latest gadgets!'),
('Privacy', 'TechGear Pro is committed to protecting your privacy. We use industry-standard encryption for all transactions and never share your personal information with third parties without your explicit consent.');

-- Add a function to update embeddings
CREATE OR REPLACE FUNCTION match_documents(query_embedding vector(1536), match_threshold float, match_count int)
RETURNS TABLE(id bigint, content text, similarity float)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    customer_service_info.id,
    customer_service_info.content,
    1 - (customer_service_info.embedding <=> query_embedding) AS similarity
  FROM customer_service_info
  WHERE 1 - (customer_service_info.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

