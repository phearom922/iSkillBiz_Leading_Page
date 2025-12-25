-- Seed initial sections
INSERT INTO sections (name, type, "order", is_active) VALUES
    ('Hero Section', 'hero', 1, true),
    ('Why iskillbiz', 'text', 2, true),
    ('Differentiation', 'youtube', 3, true),
    ('Pain Points', 'youtube', 4, true),
    ('Solution Steps', 'youtube', 5, true),
    ('Multi-Platform Support', 'text', 6, true),
    ('Features', 'text', 7, true),
    ('Use Cases', 'text', 8, true),
    ('Social Proof', 'text', 9, true),
    ('Pricing', 'pricing', 10, true),
    ('Feature Comparison', 'text', 11, true),
    ('Upsell Blocks', 'text', 12, true),
    ('FAQ', 'youtube', 13, true),
    ('Get Started', 'text', 14, true),
    ('Final CTA', 'text', 15, true)
ON CONFLICT DO NOTHING;

-- Seed initial pricing plans
INSERT INTO pricing_plans (name, price, currency, description, features, is_popular, "order") VALUES
    ('Basic', 9.00, 'USD', 'Start broadcasting with confidence', 
     '["Unlimited Bots", "Unlimited Broadcast", "AI Auto Reply", "Basic Automation", "Email Auto Responder", "Import / Export Subscribers"]'::jsonb, 
     false, 1),
    ('Standard', 19.00, 'USD', 'Built to grow engagement and sales', 
     '["Everything in Basic", "Message sequences & follow-ups", "Subscriber tags & segments", "Advanced engagement tools", "JSON API", "Webview Builder"]'::jsonb, 
     true, 2),
    ('Advance', 25.00, 'USD', 'Maximum power. Zero limits.', 
     '["Everything in Standard", "Unlimited automation", "Advanced API & Webhooks", "High-volume broadcasting", "Full integrations", "Built for teams & agencies"]'::jsonb, 
     false, 3)
ON CONFLICT (name) DO NOTHING;

-- Seed initial section content for Hero Section (Khmer only)
INSERT INTO section_content (section_id, field_name, content, language) VALUES
    ((SELECT id FROM sections WHERE name = 'Hero Section' LIMIT 1), 
     'headline', 
     'ផ្សព្វផ្សាយទៅកាន់អតិថិជនរាប់ពាន់នាក់ — ដោយមិនត្រូវការធ្វើពាណិជ្ជកម្ម ឬការងារដៃផ្ទាល់', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Hero Section' LIMIT 1), 
     'subheadline', 
     'iskillbiz ជួយអាជីវកម្មនៃការផ្ញើសារទៅជាបណ្តាញដែលមានប្រសិទ្ធភាពខ្ពស់បំផុត ដោយប្រើប្រាស់ការផ្សព្វផ្សាយស្វ័យប្រវត្តិ និង ប្រើប្រាស់ AI ឲ្យធ្វើការ', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Hero Section' LIMIT 1), 
     'cta_primary', 
     'Start Now', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Hero Section' LIMIT 1), 
     'cta_primary_link', 
     'https://t.me/iskillsbiz', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Hero Section' LIMIT 1), 
     'cta_secondary', 
     'View Pricing', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Hero Section' LIMIT 1), 
     'cta_secondary_link', 
     '#pricing', 
     'km')
ON CONFLICT (section_id, field_name, language) DO NOTHING;

