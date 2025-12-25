-- Add new columns to sections table
ALTER TABLE sections 
ADD COLUMN IF NOT EXISTS section_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS is_draggable BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_editable BOOLEAN DEFAULT true;

-- Update existing sections with section_type, is_draggable, and is_editable
-- Hero Section
UPDATE sections 
SET section_type = 'hero', is_draggable = false, is_editable = true
WHERE name = 'Hero Section';

-- YouTube Sections
UPDATE sections 
SET section_type = 'youtube', is_draggable = true, is_editable = true
WHERE name IN ('Differentiation', 'Pain Points', 'Solution Steps', 'FAQ');

-- Content Blocks (5 blocks)
UPDATE sections 
SET section_type = 'content_block', is_draggable = true, is_editable = true
WHERE name IN ('Use Cases', 'Social Proof', 'Pricing', 'Feature Comparison', 'Upsell Blocks');

-- Fixed Sections (4 sections - hardcode, not editable)
UPDATE sections 
SET section_type = 'fixed', is_draggable = false, is_editable = false
WHERE name IN ('Get Started', 'Multi-Platform Support', 'Features', 'Final CTA');

-- Create Footer section if it doesn't exist
INSERT INTO sections (name, type, section_type, "order", is_active, is_draggable, is_editable)
SELECT 'Footer', 'text', 'footer', 999, true, false, true
WHERE NOT EXISTS (SELECT 1 FROM sections WHERE name = 'Footer');

-- Update "Why iskillbiz" - this might be a dynamic section or content block
-- For now, we'll set it as content_block if it exists
UPDATE sections 
SET section_type = 'content_block', is_draggable = true, is_editable = true
WHERE name = 'Why iskillbiz' AND section_type IS NULL;

-- Create index for section_type for better query performance
CREATE INDEX IF NOT EXISTS idx_sections_section_type ON sections(section_type);
CREATE INDEX IF NOT EXISTS idx_sections_is_draggable ON sections(is_draggable);
CREATE INDEX IF NOT EXISTS idx_sections_is_editable ON sections(is_editable);

