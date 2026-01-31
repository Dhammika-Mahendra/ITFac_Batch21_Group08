INSERT INTO plants (name, price, quantity, category_id) VALUES
-- RED FLOWERS
('Red Rose Plant', 1500.00, 25, (SELECT id FROM categories WHERE name='Rose' AND parent_id IS NOT NULL LIMIT 1)),
('Red Orchid Plant', 2200.00, 10, (SELECT id FROM categories WHERE name='Orchid' AND parent_id IS NOT NULL LIMIT 1)),
('Red Tulip Plant', 1800.00, 15, (SELECT id FROM categories WHERE name='Tulip' AND parent_id IS NOT NULL LIMIT 1)),

-- YELLOW FLOWERS
('Yellow Sunflower Plant', 1200.00, 30, (SELECT id FROM categories WHERE name='Sunflower' LIMIT 1)),
('Yellow Daffodil Plant', 1400.00, 20, (SELECT id FROM categories WHERE name='Daffodil' LIMIT 1)),
('Yellow Marigold Plant', 900.00, 40, (SELECT id FROM categories WHERE name='Marigold' LIMIT 1)),

-- WHITE FLOWERS
('White Lily Plant', 2000.00, 12, (SELECT id FROM categories WHERE name='Lily' LIMIT 1)),
('White Jasmine Plant', 1600.00, 18, (SELECT id FROM categories WHERE name='Jasmine' LIMIT 1)),
('White Orchid Plant', 2300.00, 8, (SELECT id FROM categories WHERE name='Orchid' LIMIT 1)),

-- PINK FLOWERS
('Pink Rose Plant', 1700.00, 22, (SELECT id FROM categories WHERE name='Rose' AND parent_id IS NOT NULL LIMIT 1)),
('Pink Peony Plant', 2500.00, 6, (SELECT id FROM categories WHERE name='Peony' LIMIT 1)),
('Pink Carnation Plant', 1300.00, 28, (SELECT id FROM categories WHERE name='Carnation' LIMIT 1)),

-- PURPLE FLOWERS
('Purple Lavender Plant', 1900.00, 14, (SELECT id FROM categories WHERE name='Lavender' LIMIT 1)),
('Purple Iris Plant', 2100.00, 11, (SELECT id FROM categories WHERE name='Iris' LIMIT 1)),
('Purple Orchid Plant', 2600.00, 7, (SELECT id FROM categories WHERE name='Orchid' LIMIT 1)),

-- ORANGE FLOWERS
('Orange Gerbera Plant', 1600.00, 19, (SELECT id FROM categories WHERE name='Gerbera' LIMIT 1)),
('Orange Calendula Plant', 1100.00, 35, (SELECT id FROM categories WHERE name='Calendula' LIMIT 1)),
('Orange Marigold Plant', 950.00, 45, (SELECT id FROM categories WHERE name='Marigold' LIMIT 1)),

-- BLUE FLOWERS
('Blue Hydrangea Plant', 2400.00, 9, (SELECT id FROM categories WHERE name='Hydrangea' LIMIT 1)),
('Blue Bluebell Plant', 1800.00, 16, (SELECT id FROM categories WHERE name='Bluebell' LIMIT 1)),
('Blue Cornflower Plant', 1500.00, 21, (SELECT id FROM categories WHERE name='Cornflower' LIMIT 1));
