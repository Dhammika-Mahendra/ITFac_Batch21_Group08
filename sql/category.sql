-- MAIN CATEGORIES
INSERT INTO categories (name, parent_id) VALUES
('Red', NULL),
('Yellow', NULL),
('White', NULL),
('Pink', NULL),
('Purple', NULL),
('Orange', NULL),
('Blue', NULL);


-- SUB CATEGORIES
INSERT INTO categories (name, parent_id)
SELECT s.sub_name, m.id
FROM categories m
JOIN (
    SELECT 'Red' AS main_name, 'Rose' AS sub_name UNION ALL
    SELECT 'Red', 'Orchid' UNION ALL
    SELECT 'Red', 'Tulip' UNION ALL
    SELECT 'Red', 'Anthurium' UNION ALL
    SELECT 'Red', 'Dahlia' UNION ALL
    SELECT 'Red', 'Hibiscus' UNION ALL

    SELECT 'Yellow', 'Rose' UNION ALL
    SELECT 'Yellow', 'Sunflower' UNION ALL
    SELECT 'Yellow', 'Daffodil' UNION ALL
    SELECT 'Yellow', 'Marigold' UNION ALL
    SELECT 'Yellow', 'Tulip' UNION ALL

    SELECT 'White', 'Rose' UNION ALL
    SELECT 'White', 'Lily' UNION ALL
    SELECT 'White', 'Jasmine' UNION ALL
    SELECT 'White', 'Gardenia' UNION ALL
    SELECT 'White', 'Orchid' UNION ALL
    SELECT 'White', 'Tuberose' UNION ALL

    SELECT 'Pink', 'Rose' UNION ALL
    SELECT 'Pink', 'Peony' UNION ALL
    SELECT 'Pink', 'Carnation' UNION ALL
    SELECT 'Pink', 'Blossom' UNION ALL
    SELECT 'Pink', 'Tulip' UNION ALL
    SELECT 'Pink', 'Dahlia' UNION ALL

    SELECT 'Purple', 'Rose' UNION ALL
    SELECT 'Purple', 'Lavender' UNION ALL
    SELECT 'Purple', 'Iris' UNION ALL
    SELECT 'Purple', 'Violet' UNION ALL
    SELECT 'Purple', 'Petunia' UNION ALL
    SELECT 'Purple', 'Orchid' UNION ALL

    SELECT 'Orange', 'Rose' UNION ALL
    SELECT 'Orange', 'Gerbera' UNION ALL
    SELECT 'Orange', 'Calendula' UNION ALL
    SELECT 'Orange', 'Marigold' UNION ALL
    SELECT 'Orange', 'Tulip' UNION ALL

    SELECT 'Blue', 'Rose' UNION ALL
    SELECT 'Blue', 'Hydrangea' UNION ALL
    SELECT 'Blue', 'Bluebell' UNION ALL
    SELECT 'Blue', 'Cornflower' UNION ALL
    SELECT 'Blue', 'Iris'
) s
ON m.name = s.main_name
WHERE m.parent_id IS NULL;
