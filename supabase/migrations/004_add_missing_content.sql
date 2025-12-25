-- Add content fields for sections that don't have any yet
-- Only Khmer (km) language

-- Why iskillbiz section
INSERT INTO section_content (section_id, field_name, content, language) VALUES
    ((SELECT id FROM sections WHERE name = 'Why iskillbiz' LIMIT 1), 
     'title', 
     'ហេតុអ្វីបានជាត្រូវជ្រើសរើស iskillbiz?', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Why iskillbiz' LIMIT 1), 
     'description', 
     'យើងមិនមែនគ្រាន់តែជាឧបករណ៍ Chatbot ធម្មតាៗនោះទេ តែយើងគឺជាវេទិកាផ្សព្វផ្សាយពេញលេញដែលបានរចនាដើម្បីទទួលបានលទ្ធផលអាជីវកម្មពិតៗ', 
     'km')
ON CONFLICT (section_id, field_name, language) DO NOTHING;

-- Multi-Platform Support section
INSERT INTO section_content (section_id, field_name, content, language) VALUES
    ((SELECT id FROM sections WHERE name = 'Multi-Platform Support' LIMIT 1), 
     'title', 
     'គាំទ្រវេទិកាច្រើន', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Multi-Platform Support' LIMIT 1), 
     'description', 
     'ទាក់ទងអតិថិជនរបស់អ្នកនៅកន្លែងណាក៏បាន។ វេទិកាបន្ថែមទៀតនឹងមកដល់ឆាប់ៗនេះ។', 
     'km')
ON CONFLICT (section_id, field_name, language) DO NOTHING;

-- Features section
INSERT INTO section_content (section_id, field_name, content, language) VALUES
    ((SELECT id FROM sections WHERE name = 'Features' LIMIT 1), 
     'title', 
     'មុខងារដ៏មានអានុភាព', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Features' LIMIT 1), 
     'description', 
     'អ្វីៗទាំងអស់ដែលអ្នកត្រូវការដើម្បីផ្សព្វផ្សាយសារ និងទាក់ទងជាមួយអតិថិជនរបស់អ្នកក្នុងកម្រិតធំ។', 
     'km')
ON CONFLICT (section_id, field_name, language) DO NOTHING;

-- Use Cases section
INSERT INTO section_content (section_id, field_name, content, language) VALUES
    ((SELECT id FROM sections WHERE name = 'Use Cases' LIMIT 1), 
     'title', 
     'ករណីប្រើប្រាស់', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Use Cases' LIMIT 1), 
     'description', 
     'ល្អបំផុតសម្រាប់ពាណិជ្ជកម្មអេឡិចត្រូនិច វគ្គសិក្សាអនឡាញ ក្រុមលក់ ទីភ្នាក់ងារ និង SME។', 
     'km')
ON CONFLICT (section_id, field_name, language) DO NOTHING;

-- Social Proof section
INSERT INTO section_content (section_id, field_name, content, language) VALUES
    ((SELECT id FROM sections WHERE name = 'Social Proof' LIMIT 1), 
     'title', 
     'ទុកចិត្តដោយអាជីវកម្ម', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Social Proof' LIMIT 1), 
     'description', 
     'ចូលរួមជាមួយអាជីវកម្មរាប់ពាន់ដែលកំពុងប្រើប្រាស់ iskillbiz ដើម្បីពង្រីកមូលដ្ឋានអតិថិជនរបស់ពួកគេ។', 
     'km')
ON CONFLICT (section_id, field_name, language) DO NOTHING;

-- Feature Comparison section
INSERT INTO section_content (section_id, field_name, content, language) VALUES
    ((SELECT id FROM sections WHERE name = 'Feature Comparison' LIMIT 1), 
     'title', 
     'ប្រៀបធៀបផែនការ', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Feature Comparison' LIMIT 1), 
     'description', 
     'សូមមើលផែនការណាដែលសមរម្យសម្រាប់តម្រូវការអាជីវកម្មរបស់អ្នក។', 
     'km')
ON CONFLICT (section_id, field_name, language) DO NOTHING;

-- Upsell Blocks section
INSERT INTO section_content (section_id, field_name, content, language) VALUES
    ((SELECT id FROM sections WHERE name = 'Upsell Blocks' LIMIT 1), 
     'title', 
     'ដំឡើងផែនការរបស់អ្នក', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Upsell Blocks' LIMIT 1), 
     'description', 
     'បើកមុខងារបន្ថែមទៀត និងពង្រីកអាជីវកម្មរបស់អ្នកកាន់តែលឿន។', 
     'km')
ON CONFLICT (section_id, field_name, language) DO NOTHING;

-- Get Started section
INSERT INTO section_content (section_id, field_name, content, language) VALUES
    ((SELECT id FROM sections WHERE name = 'Get Started' LIMIT 1), 
     'title', 
     'ចាប់ផ្តើមក្នុងរយៈពេលតែប៉ុន្មាននាទី', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Get Started' LIMIT 1), 
     'description', 
     'គ្មានការរៀបចំស្មុគ្រស្មាញ។ គ្មានការរង់ចាំ។ ចាប់ផ្តើមផ្សព្វផ្សាយទៅកាន់អតិថិជនរបស់អ្នកថ្ងៃនេះ។', 
     'km')
ON CONFLICT (section_id, field_name, language) DO NOTHING;

-- Final CTA section
INSERT INTO section_content (section_id, field_name, content, language) VALUES
    ((SELECT id FROM sections WHERE name = 'Final CTA' LIMIT 1), 
     'title', 
     'ត្រៀមខ្លួនដើម្បីផ្សព្វផ្សាយដោយឆ្លាតវៃ?', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Final CTA' LIMIT 1), 
     'description', 
     'អតិថិជនរបស់អ្នកមាននៅលើកម្មវិធី chat រួចហើយ។ ឥឡូវនេះទាក់ទងពួកគេដោយវិជ្ជាជីវៈ — ក្នុងកម្រិតធំ។', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Final CTA' LIMIT 1), 
     'cta_primary', 
     'Start Now', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Final CTA' LIMIT 1), 
     'cta_primary_link', 
     'https://t.me/iskillsbiz', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Final CTA' LIMIT 1), 
     'cta_secondary', 
     'Contact Sales', 
     'km'),
    ((SELECT id FROM sections WHERE name = 'Final CTA' LIMIT 1), 
     'cta_secondary_link', 
     'https://t.me/iskillsbiz', 
     'km')
ON CONFLICT (section_id, field_name, language) DO NOTHING;

