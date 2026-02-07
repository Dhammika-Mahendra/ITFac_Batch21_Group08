const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load database credentials from cypress.env.json
const envPath = path.join(__dirname, '..', 'cypress.env.json');
const env = JSON.parse(fs.readFileSync(envPath, 'utf8'));

const dbConfig = {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    multipleStatements: true // Required to run multiple SQL statements at once
};

// SQL files to execute in order
const sqlFiles = [
    'category.sql',
    'plant.sql',
    'sales.sql'
];

async function executeSqlFile(connection, filePath) {
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`Executing: ${path.basename(filePath)}...`);
    
    try {
        await connection.query(sql);
        console.log(`✓ ${path.basename(filePath)} executed successfully`);
    } catch (error) {
        console.error(`✗ Error executing ${path.basename(filePath)}:`, error.message);
        throw error;
    }
}

async function seedDatabase() {
    let connection;
    
    try {
        console.log('Connecting to database...');
        console.log(`  Host: ${dbConfig.host}`);
        console.log(`  Database: ${dbConfig.database}`);
        console.log(`  User: ${dbConfig.user}`);
        console.log('');
        
        connection = await mysql.createConnection(dbConfig);
        console.log('✓ Connected to database successfully\n');
        
        const sqlDir = path.join(__dirname, '..', 'sql');
        
        for (const file of sqlFiles) {
            const filePath = path.join(sqlDir, file);
            
            if (!fs.existsSync(filePath)) {
                console.error(`✗ File not found: ${filePath}`);
                continue;
            }
            
            await executeSqlFile(connection, filePath);
        }
        
        console.log('\n✓ Database seeding completed successfully!');
        
    } catch (error) {
        console.error('\n✗ Database seeding failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connection closed.');
        }
    }
}

// Run the seeding
seedDatabase();
