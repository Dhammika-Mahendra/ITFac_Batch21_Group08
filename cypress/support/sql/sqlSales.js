export function executeSqlFile(sqlFileName) {
    const sqlFilePath = `sql/${sqlFileName}`;
    return cy.task("executeSql", sqlFilePath).then((result) => {
        if (!result.success) {
            cy.log(`SQL execution failed: ${result.error}`);
            throw new Error(`SQL execution failed: ${result.error}`);
        }
        cy.log(`SQL file executed successfully: ${sqlFileName}`);
        return null;
    });
}

export function backupSalesData() {
    return executeSqlFile("salesBackup.sql");
}

export function deleteAllSales() {
    return executeSqlFile("salesDeleteAll.sql");
}

export function restoreSalesData() {
    return executeSqlFile("salesRestore.sql");
}
