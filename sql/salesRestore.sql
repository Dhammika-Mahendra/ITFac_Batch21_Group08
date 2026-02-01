DELETE FROM sales;
INSERT INTO sales SELECT * FROM sales_backup;
DROP TABLE IF EXISTS sales_backup;
