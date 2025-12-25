-- First, ensure section_type, is_draggable, and is_editable columns exist
DO $$ 
BEGIN
    -- Add section_type column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sections' AND column_name = 'section_type'
    ) THEN
        ALTER TABLE sections ADD COLUMN section_type VARCHAR(50);
    END IF;

    -- Add is_draggable column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sections' AND column_name = 'is_draggable'
    ) THEN
        ALTER TABLE sections ADD COLUMN is_draggable BOOLEAN DEFAULT true;
    END IF;

    -- Add is_editable column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sections' AND column_name = 'is_editable'
    ) THEN
        ALTER TABLE sections ADD COLUMN is_editable BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Ensure Hero Section exists (using conditional INSERT based on available columns)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sections WHERE name = 'Hero Section') THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'sections' AND column_name = 'section_type'
        ) THEN
            INSERT INTO sections (name, type, section_type, "order", is_active, is_draggable, is_editable)
            VALUES ('Hero Section', 'hero', 'hero', 1, true, false, true);
        ELSE
            INSERT INTO sections (name, type, "order", is_active)
            VALUES ('Hero Section', 'hero', 1, true);
        END IF;
    END IF;
END $$;

-- Ensure Hero Section has default content (only if section was just created or content doesn't exist)
INSERT INTO section_content (section_id, field_name, content, language)
SELECT 
    (SELECT id FROM sections WHERE name = 'Hero Section' LIMIT 1),
    field_name,
    content,
    language
FROM (VALUES
    ('headline', 'ផ្សព្វផ្សាយទៅកាន់អតិថិជនរាប់ពាន់នាក់ — ដោយមិនត្រូវការធ្វើពាណិជ្ជកម្ម ឬការងារដៃផ្ទាល់', 'km'),
    ('subheadline', 'iskillbiz ជួយអាជីវកម្មនៃការផ្ញើសារទៅជាបណ្តាញដែលមានប្រសិទ្ធភាពខ្ពស់បំផុត ដោយប្រើប្រាស់ការផ្សព្វផ្សាយស្វ័យប្រវត្តិ និង ប្រើប្រាស់ AI ឲ្យធ្វើការ', 'km'),
    ('cta_primary', 'Start Now', 'km'),
    ('cta_primary_link', 'https://t.me/iskillsbiz', 'km'),
    ('cta_secondary', 'View Pricing', 'km'),
    ('cta_secondary_link', '#pricing', 'km')
) AS defaults(field_name, content, language)
WHERE NOT EXISTS (
    SELECT 1 FROM section_content 
    WHERE section_id = (SELECT id FROM sections WHERE name = 'Hero Section' LIMIT 1)
    AND field_name = defaults.field_name
    AND language = defaults.language
);

-- Update Hero Section to ensure correct type and properties (only if columns exist)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sections' AND column_name = 'section_type'
    ) THEN
        UPDATE sections 
        SET 
            section_type = 'hero',
            is_draggable = COALESCE(is_draggable, false),
            is_editable = COALESCE(is_editable, true),
            type = 'hero'
        WHERE name = 'Hero Section';
    ELSE
        -- If new columns don't exist, just update type
        UPDATE sections 
        SET type = 'hero'
        WHERE name = 'Hero Section';
    END IF;
END $$;

