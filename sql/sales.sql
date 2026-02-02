INSERT INTO sales (quantity, sold_at, total_price, plant_id) VALUES
-- RED FLOWERS SALES
(2, '2026-01-05 10:15:30.000000',
 2 * (SELECT price FROM plants WHERE name = 'Red Rose Plant' LIMIT 1),
 (SELECT id FROM plants WHERE name = 'Red Rose Plant' LIMIT 1)),

(1, '2026-01-06 14:40:00.000000',
 1 * (SELECT price FROM plants WHERE name = 'Red Orchid Plant' LIMIT 1),
 (SELECT id FROM plants WHERE name = 'Red Orchid Plant' LIMIT 1)),

-- YELLOW FLOWERS SALES
(5, '2026-01-07 09:25:10.000000',
 5 * (SELECT price FROM plants WHERE name = 'Yellow Sunflower Plant' LIMIT 1),
 (SELECT id FROM plants WHERE name = 'Yellow Sunflower Plant' LIMIT 1)),

(3, '2026-01-08 16:10:45.000000',
 3 * (SELECT price FROM plants WHERE name = 'Yellow Marigold Plant' LIMIT 1),
 (SELECT id FROM plants WHERE name = 'Yellow Marigold Plant' LIMIT 1)),

-- WHITE FLOWERS SALES
(2, '2026-01-09 11:05:20.000000',
 2 * (SELECT price FROM plants WHERE name = 'White Lily Plant' LIMIT 1),
 (SELECT id FROM plants WHERE name = 'White Lily Plant' LIMIT 1)),

(4, '2026-01-10 18:55:00.000000',
 4 * (SELECT price FROM plants WHERE name = 'White Jasmine Plant' LIMIT 1),
 (SELECT id FROM plants WHERE name = 'White Jasmine Plant' LIMIT 1)),

-- PINK FLOWERS SALES
(3, '2026-01-11 13:30:15.000000',
 3 * (SELECT price FROM plants WHERE name = 'Pink Rose Plant' LIMIT 1),
 (SELECT id FROM plants WHERE name = 'Pink Rose Plant' LIMIT 1)),

-- PURPLE FLOWERS SALES
(1, '2026-01-12 15:45:50.000000',
 1 * (SELECT price FROM plants WHERE name = 'Purple Lavender Plant' LIMIT 1),
 (SELECT id FROM plants WHERE name = 'Purple Lavender Plant' LIMIT 1)),

-- ORANGE FLOWERS SALES
(6, '2026-01-13 10:20:00.000000',
 6 * (SELECT price FROM plants WHERE name = 'Orange Marigold Plant' LIMIT 1),
 (SELECT id FROM plants WHERE name = 'Orange Marigold Plant' LIMIT 1)),

-- BLUE FLOWERS SALES
(2, '2026-01-14 17:35:25.000000',
 2 * (SELECT price FROM plants WHERE name = 'Blue Hydrangea Plant' LIMIT 1),
 (SELECT id FROM plants WHERE name = 'Blue Hydrangea Plant' LIMIT 1));
