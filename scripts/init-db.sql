-- First, ensure we have the right extensions
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop existing table if it exists
DROP TABLE IF EXISTS customer_service_info;

-- Create the customer_service_info table
CREATE TABLE customer_service_info (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    info_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    embedding vector(1536)
);

-- Create indexes
CREATE INDEX idx_customer_service_info_content ON customer_service_info USING GIN (to_tsvector('english', content));
CREATE INDEX idx_customer_service_info_type ON customer_service_info(info_type);
CREATE INDEX idx_customer_service_info_metadata ON customer_service_info USING GIN (metadata);

-- Insert TechPro X1 Smartphone information
INSERT INTO customer_service_info (title, content, info_type, metadata) VALUES
('Product Information: TechPro X1 Smartphone',
'The TechPro X1 is a cutting-edge flagship smartphone designed for professionals and tech enthusiasts. Key features include:

Performance:
- SnapCore V9+ chip for top-tier performance
- 16GB LPDDR5 RAM
- Up to 1TB UFS 4.0 storage

Display:
- 6.8" QHD+ AMOLED Display
- 144Hz refresh rate
- 2000 nits peak brightness
- Ultra-slim bezels with hole-punch front camera

Camera System:
- 108 MP AI-powered main sensor with OIS
- 12 MP periscope lens with 10x hybrid zoom
- 50 MP 120° ultra-wide lens with macro
- 32 MP front camera

Battery & Charging:
- 5000mAh battery
- 150W HyperCharge technology
- 50W wireless charging
- AI-powered adaptive power management

Build & Design:
- Aerospace-grade aluminum frame
- Corning Gorilla Glass Victus 2
- IP68-certified
- Available in Graphite Black, Ice White, and Aurora Blue

Price: $799',
'product_specs',
'{"product_name": "TechPro X1 Smartphone", "category": "Smartphones", "price": 799}');

-- Insert SoundWave Pro Earbuds information
INSERT INTO customer_service_info (title, content, info_type, metadata) VALUES
('Product Information: SoundWave Pro Earbuds',
'Premium wireless earbuds with advanced features:

Audio:
- Active noise cancellation
- Premium sound quality
- Custom-tuned drivers
- Spatial audio support

Battery:
- 8-hour battery life
- 24 additional hours with charging case
- Fast charging (15 min = 2 hours playback)
- Wireless charging case

Features:
- Touch controls
- Voice assistant support
- IPX5 water resistance
- Automatic ear detection
- Multipoint connectivity

Price: $199',
'product_specs',
'{"product_name": "SoundWave Pro Earbuds", "category": "Audio", "price": 199}');

-- Insert PowerMax 20000 Charger information
INSERT INTO customer_service_info (title, content, info_type, metadata) VALUES
('Product Information: PowerMax 20000 Charger',
'High-capacity portable charger with advanced features:

Capacity & Charging:
- 20,000mAh battery capacity
- Charges up to 3 devices simultaneously
- 65W maximum output
- Power Delivery 3.0 support

Compatibility:
- Universal USB-C and USB-A ports
- Compatible with phones, tablets, laptops
- Supports all major fast charging protocols

Features:
- LED display showing power levels
- Compact design
- Safety protection systems
- Pass-through charging

Price: $79',
'product_specs',
'{"product_name": "PowerMax 20000 Charger", "category": "Accessories", "price": 79}');

-- Insert TechPro Watch Elite information
INSERT INTO customer_service_info (title, content, info_type, metadata) VALUES
('Product Information: TechPro Watch Elite',
'Advanced smartwatch with comprehensive health and fitness features:

Health Monitoring:
- ECG monitoring
- Blood oxygen tracking
- Heart rate monitoring
- Sleep tracking
- Stress monitoring

Fitness Features:
- 40+ workout modes
- GPS tracking
- Automatic workout detection
- Swimming tracking (5ATM water resistance)

Display & Design:
- 1.4" AMOLED display
- Always-on display option
- Premium stainless steel case
- Interchangeable bands

Smart Features:
- 5-day battery life
- Wireless payments
- Voice assistant
- Smartphone notifications
- Music control

Price: $299',
'product_specs',
'{"product_name": "TechPro Watch Elite", "category": "Wearables", "price": 299}');

-- Insert UltraBook Pro information
INSERT INTO customer_service_info (title, content, info_type, metadata) VALUES
('Product Information: UltraBook Pro',
'Professional-grade laptop for demanding users:

Performance:
- Intel i9 processor
- 32GB DDR5 RAM
- 1TB NVMe SSD
- NVIDIA RTX 4070 graphics

Display:
- 14" 4K OLED display
- 120Hz refresh rate
- HDR support
- Anti-glare coating

Design:
- Aluminum unibody
- Backlit keyboard
- Large glass trackpad
- Thunderbolt 4 ports

Features:
- Windows 11 Pro
- AI-enhanced webcam
- Studio-quality speakers
- Advanced cooling system
- 12-hour battery life

Price: $1499',
'product_specs',
'{"product_name": "UltraBook Pro", "category": "Computers", "price": 1499}');

-- Insert GamePro Controller information
INSERT INTO customer_service_info (title, content, info_type, metadata) VALUES
('Product Information: GamePro Controller',
'Professional gaming controller with advanced features:

Controls:
- Customizable buttons
- Hall effect triggers
- Adjustable thumbsticks
- Programmable back paddles

Features:
- 40-hour battery life
- Haptic feedback
- RGB lighting
- Bluetooth 5.0
- USB-C connectivity

Compatibility:
- PC support
- Console support
- Mobile gaming support
- Multiple profiles

Design:
- Ergonomic grip
- Premium materials
- Carrying case included
- Customizable faceplate

Price: $69',
'product_specs',
'{"product_name": "GamePro Controller", "category": "Gaming", "price": 69}');

-- Insert SmartHome Hub information
INSERT INTO customer_service_info (title, content, info_type, metadata) VALUES
('Product Information: SmartHome Hub',
'Central smart home control system:

Connectivity:
- WiFi 6
- Bluetooth 5.0
- Zigbee support
- Matter compatible

Features:
- Voice control
- Device automation
- Energy monitoring
- Security system integration
- Temperature control

Compatibility:
- 100+ smart device brands
- All major voice assistants
- IFTTT support
- Smart displays

Security:
- End-to-end encryption
- Two-factor authentication
- Regular security updates
- Local processing option

Price: $129',
'product_specs',
'{"product_name": "SmartHome Hub", "category": "Smart Home", "price": 129}');

-- Insert 4K Ultra Camera information
INSERT INTO customer_service_info (title, content, info_type, metadata) VALUES
('Product Information: 4K Ultra Camera',
'Professional-grade camera for content creators:

Video:
- 4K 60fps recording
- 1080p 240fps slow-motion
- HDR video support
- 10-bit color depth

Photo:
- 24MP sensor
- Dual native ISO
- 15 stops dynamic range
- RAW support

Features:
- 5-axis stabilization
- Night mode
- AI autofocus
- Time-lapse mode
- Live streaming

Design:
- Weather-sealed body
- Flip screen
- Custom function buttons
- Dual card slots

Price: $449',
'product_specs',
'{"product_name": "4K Ultra Camera", "category": "Cameras", "price": 449}');

-- Insert TechPro Tablet Pro information
INSERT INTO customer_service_info (title, content, info_type, metadata) VALUES
('Product Information: TechPro Tablet Pro',
'Professional tablet for creators and productivity:

Performance:
- M2 chip
- 8GB RAM
- Up to 512GB storage
- Neural engine

Display:
- 11" Retina display
- ProMotion 120Hz
- True Tone
- P3 wide color

Features:
- Apple Pencil support
- Face ID
- USB-C port
- 5G connectivity
- Center Stage camera

Battery:
- 10-hour battery life
- Fast charging
- USB-C charging
- Battery health management

Price: $599',
'product_specs',
'{"product_name": "TechPro Tablet Pro", "category": "Tablets", "price": 599}');

-- Insert customer service policies
INSERT INTO customer_service_info (title, content, info_type, metadata) VALUES
('Return Policy',
'Our return policy allows returns within 30 days of purchase. Items must be in original condition with all accessories. Shipping costs for returns are covered for defective items.',
'policy',
'{"policy_type": "returns"}'),

('Shipping Information',
'We offer free standard shipping on orders over $50. Express shipping is available for an additional fee. International shipping available to select countries.',
'policy',
'{"policy_type": "shipping"}'),

('Warranty Policy',
'All products come with a standard 1-year warranty covering manufacturing defects. Extended warranty options are available for purchase.',
'policy',
'{"policy_type": "warranty"}'),

('Price Match Guarantee',
'We offer price matching against major retailers. If you find a lower price within 14 days of purchase, we''ll refund the difference.',
'policy',
'{"policy_type": "price_match"}'),

('Technical Support',
'Free technical support is available 24/7 via chat, email, or phone. Our expert team can help with setup, troubleshooting, and general product questions.',
'policy',
'{"policy_type": "support"}'); 