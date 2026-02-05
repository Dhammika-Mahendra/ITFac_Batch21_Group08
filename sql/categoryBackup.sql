CREATE TABLE sales_backup SELECT * FROM sales;
DELETE FROM sales;
DELETE FROM inventory;
CREATE TABLE plants_backup SELECT * FROM plants;
DELETE FROM plants;
CREATE TABLE categories_backup SELECT * FROM categories;
DELETE FROM categories WHERE parent_id IS NOT NULL;
DELETE FROM categories WHERE parent_id IS NULL;