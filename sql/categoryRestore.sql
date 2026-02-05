INSERT INTO categories SELECT * FROM categories_backup WHERE parent_id IS NULL;
INSERT INTO categories SELECT * FROM categories_backup WHERE parent_id IS NOT NULL;
DROP TABLE IF EXISTS categories_backup;
INSERT INTO plants SELECT * FROM plants_backup;
DROP TABLE IF EXISTS plants_backup;
INSERT INTO sales SELECT * FROM sales_backup;
DROP TABLE IF EXISTS sales_backup;