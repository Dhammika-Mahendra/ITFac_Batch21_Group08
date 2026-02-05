const BASE_URL_ERROR = "Missing BASE_URL env variable. Configure it before running API tests.";
const AUTH_TOKEN_ERROR = "Missing @authToken. Call an API login helper before invoking sales APIs.";

function ensureBaseUrl() {
	const baseUrl = Cypress.env("BASE_URL");
	if (!baseUrl) {
		throw new Error(BASE_URL_ERROR);
	}
	return baseUrl.replace(/\/$/, "");
}

function normalizePath(path) {
	if (!path) {
		throw new Error("A relative API path is required.");
	}
	return path.startsWith("/") ? path : `/${path}`;
}

function salesRequest({
	method = "GET",
	path,
	body,
	qs,
	headers = {},
	alias = "salesResponse",
	failOnStatusCode = false,
}) {
	const baseUrl = ensureBaseUrl();
	const url = `${baseUrl}${normalizePath(path)}`;
	return cy.get("@authToken").then((token) => {
		if (!token) {
			throw new Error(AUTH_TOKEN_ERROR);
		}
		return cy
			.request({
				method,
				url,
				body,
				qs,
				headers: {
					Authorization: `Bearer ${token}`,
					...headers,
				},
				failOnStatusCode,
			})
			.as(alias);
	});
}

export function sellPlant(plantId, quantity, responseAlias = "sellPlantResponse") {
	if (!plantId && plantId !== 0) {
		throw new Error("plantId is required to sell a plant.");
	}
	if (!quantity && quantity !== 0) {
		throw new Error("quantity is required to sell a plant.");
	}
	return salesRequest({ method: "POST", path: `/api/sales/plant/${plantId}`, qs: { quantity }, alias: responseAlias });
}

export function getAllSales(responseAlias = "salesResponse") {
	return salesRequest({ path: "/api/sales", alias: responseAlias });
}

export function getSaleById(saleId, responseAlias = "saleResponse") {
	if (!saleId && saleId !== 0) {
		throw new Error("saleId is required to fetch a sale.");
	}
	return salesRequest({ path: `/api/sales/${saleId}`, alias: responseAlias });
}

export function deleteSale(saleId, responseAlias = "deleteSaleResponse") {
	if (!saleId && saleId !== 0) {
		throw new Error("saleId is required to delete a sale.");
	}
	return salesRequest({ method: "DELETE", path: `/api/sales/${saleId}`, alias: responseAlias });
}

export function getSalesPage(query = {}, responseAlias = "salesPageResponse") {
	return salesRequest({ path: "/api/sales/page", qs: query, alias: responseAlias });
}

export function validateSalesResponse(response) {
	expect(response.body.content, "sales payload").to.be.an("array");
	// Generic validation - accepts both empty and populated arrays
	expect(response.body, "response body should have pagination properties").to.have.property("content");
	expect(response.body, "response should have totalElements").to.have.property("totalElements");
	return response;
}

export function validateSalesSortedByDate(response) {
	const sales = response.body.content;
	
	if (!sales || sales.length === 0) {
		// Valid response with no data - skip sorting validation
		return response;
	}
	
	// Verify sales are sorted by soldAt in descending order (newest first)
	for (let i = 0; i < sales.length - 1; i++) {
		const currentDate = new Date(sales[i].soldAt).getTime();
		const nextDate = new Date(sales[i + 1].soldAt).getTime();
		expect(currentDate, `Sales at index ${i} should be >= sales at index ${i + 1} (descending order)`).to.be.at.least(nextDate);
	}
	return response;
}

export function validateSalesSortedByPlantName(response) {
	const sales = response.body.content;
	
	if (!sales || sales.length === 0) {
		// Valid response with no data - skip sorting validation
		return response;
	}
	
	// Verify sales are sorted by plantName in alphabetical order (ascending)
	for (let i = 0; i < sales.length - 1; i++) {
		const currentName = sales[i].plantName ? sales[i].plantName.toLowerCase() : "";
		const nextName = sales[i + 1].plantName ? sales[i + 1].plantName.toLowerCase() : "";
		const comparison = currentName.localeCompare(nextName);
		expect(comparison, `Sales should be sorted alphabetically`).to.be.at.most(0);
	}
	return response;
}

export function validateSalesErrorResponse(response) {
	expect(response.status, "error status").to.equal(500);
	expect(response.body.message, "error message").to.exist;
	expect(response.body.message, "error message should not be empty").to.not.be.empty;
	return response;
}

export function validateSalesSortedByQuantity(response) {
	const sales = response.body.content;
	
	if (!sales || sales.length === 0) {
		// Valid response with no data - skip sorting validation
		return response;
	}
	
	// Verify sales are sorted by quantity in ascending order (lowest to highest)
	for (let i = 0; i < sales.length - 1; i++) {
		const currentQuantity = sales[i].quantity ?? 0;
		const nextQuantity = sales[i + 1].quantity ?? 0;
		expect(currentQuantity, `Sales should be sorted by quantity in ascending order`).to.be.at.most(nextQuantity);
	}
	return response;
}

export function validateSalesSortedByTotalPrice(response) {
	const sales = response.body.content;
	
	if (!sales || sales.length === 0) {
		// Valid response with no data - skip sorting validation
		return response;
	}
	
	// Verify sales are sorted by totalPrice in ascending order (lowest to highest)
	for (let i = 0; i < sales.length - 1; i++) {
		const currentTotal = Number(sales[i].totalPrice ?? 0);
		const nextTotal = Number(sales[i + 1].totalPrice ?? 0);
		expect(currentTotal, `Sales should be sorted by total price in ascending order`).to.be.at.most(nextTotal);
	}
	return response;
}

function validateSalesNotFoundResponse(response) {
	expect(response.status, "error status").to.be.oneOf([404, 500]);
	expect(response.body.message, "error message").to.exist;
	expect(response.body.message, "error message should mention not found").to.include("not found");
	return response;
}

export function validateSingleSaleResponse(response, expectedId) {
	expect(response.status, "response status").to.equal(200);
	expect(response.body, "sale object").to.exist;
	expect(response.body.id, "sale ID").to.equal(expectedId);
	expect(response.body.id, "sale ID should be defined").to.not.be.undefined;
	return response;
}

export function validateDeleteSaleErrorResponse(response) {
	expect(response.status, "error status").to.be.oneOf([404, 500]);
	expect(response.body.message, "error message").to.exist;
	expect(response.body.message, "error message should mention not found").to.include("not found");
	return response;
}

export function createSaleWithoutPlant(quantity, responseAlias = "createSaleWithoutPlantResponse") {
	if (!quantity && quantity !== 0) {
		throw new Error("quantity is required to create a sale.");
	}
	return salesRequest({ method: "POST", path: "/api/sales/plant", qs: { quantity }, alias: responseAlias });
}

export function validateMissingPlantErrorResponse(response) {
	expect(response.status, "error status").to.equal(500);
	expect(response.body.message, "error message").to.exist;
	// The error can be either "No static resource" or "Request method 'POST' is not supported"
	const errorMsg = response.body.message;
	const isValidError = errorMsg.includes("No static resource") || errorMsg.includes("Request method") || errorMsg.includes("not supported");
	expect(isValidError, `Error message should indicate invalid endpoint or method`).to.be.true;
	return response;
}

export function sellPlantWithoutAuth(plantId, quantity, responseAlias = "unauthenticatedSaleResponse") {
	if (!plantId && plantId !== 0) {
		throw new Error("plantId is required to sell a plant.");
	}
	if (!quantity && quantity !== 0) {
		throw new Error("quantity is required to sell a plant.");
	}
	const baseUrl = ensureBaseUrl();
	const url = `${baseUrl}/api/sales/plant/${plantId}`;
	return cy
		.request({
			method: "POST",
			url,
			qs: { quantity },
			failOnStatusCode: false,
		})
		.as(responseAlias);
}

export function validateUnauthorizedErrorResponse(response) {
	expect(response.status, "error status").to.equal(401);
	expect(response.body.message, "error message").to.exist;
	expect(response.body.message, "error message should mention Unauthorized").to.include("Unauthorized");
	return response;
}

export function validateForbiddenErrorResponse(response) {
	expect(response.status, "error status").to.equal(403);
	expect(response.body.message, "error message").to.exist;
	expect(response.body.message, "error message should mention Forbidden or Access Denied").to.match(/Forbidden|Access Denied|access denied/i);
	return response;
}

export function validateNegativeQuantityOrZeroErrorResponse(response, expectedMessage) {
	expect(response.status, "error status").to.equal(400);
	expect(response.body.message, "error message").to.exist;
	expect(response.body.message, "error message should match").to.equal(expectedMessage);
	return response;
}

export function validateDecimalQuantityErrorResponse(response) {
	expect(response.status, "error status").to.equal(500);
	expect(response.body.message, "error message").to.exist;
	const errorMsg = response.body.message;
	const isValidError = errorMsg.includes("Failed to convert") && errorMsg.includes("java.lang.String") && errorMsg.includes("int");
	expect(isValidError, "Error message should indicate type conversion failure from String to int").to.be.true;
	return response;
}

export function validateNonNumericQuantityErrorResponse(response) {
	expect(response.status, "error status").to.equal(500);
	expect(response.body.message, "error message").to.exist;
	const errorMsg = response.body.message;
	const isValidError = errorMsg.includes("Failed to convert") && errorMsg.includes("java.lang.String") && errorMsg.includes("int");
	expect(isValidError, "Error message should indicate type conversion failure from String to int for non-numeric input").to.be.true;
	return response;
}

export function getPlantWithStock() {
	const baseUrl = ensureBaseUrl();
	const url = `${baseUrl}/api/plants`;
	
	return cy.get("@authToken").then((token) => {
		if (!token) {
			throw new Error(AUTH_TOKEN_ERROR);
		}
		return cy
			.request({
				method: "GET",
				url,
				headers: {
					Authorization: `Bearer ${token}`,
				},
				failOnStatusCode: false,
			})
			.as("plantsResponse")
			.then((response) => {
				const plants = response.body;
				if (!plants || !Array.isArray(plants) || plants.length === 0) {
					throw new Error("No plants found in the system");
				}
				
				// Prefer plant with stock > 0, but fallback to any plant with defined stock
				let selectedPlant = plants.find(p => p.stock !== undefined && p.stock > 0);
				
				if (!selectedPlant) {
					// If no plant has stock > 0, use any plant with stock field defined
					selectedPlant = plants.find(p => p.stock !== undefined);
				}
				
				if (!selectedPlant) {
					// Last resort: use first plant
					selectedPlant = plants[0];
					cy.log("Warning: Using plant without stock field defined");
				}
				
				const stock = selectedPlant.stock !== undefined ? selectedPlant.stock : 0;
				cy.log(`Found plant - ID: ${selectedPlant.id}, Available Stock: ${stock}`);
				
				// Chain cy.wrap commands properly
				return cy.wrap(selectedPlant.id).as("plantId").then(() => {
					return cy.wrap(stock).as("plantStock");
				});
			});
	});
}

export function createSaleExceedingStock() {
	return cy.get("@plantId").then((plantId) => {
		return cy.get("@plantStock").then((stock) => {
			const exceedingQuantity = stock + 100;
			cy.log(`Attempting to sell ${exceedingQuantity} units when only ${stock} available`);
			return sellPlant(plantId, exceedingQuantity, "insufficientStockResponse");
		});
	});
}

export function validateInsufficientStockErrorResponse(response) {
	expect(response.status, "error status").to.equal(400);
	expect(response.body.message, "error message").to.exist;
	const errorMsg = response.body.message.toLowerCase();
	const isValidError = errorMsg.includes("stock") || errorMsg.includes("insufficient") || errorMsg.includes("not enough") || errorMsg.includes("exceed");
	expect(isValidError, "Error message should indicate insufficient stock").to.be.true;
	return response;
}

export { validateSalesNotFoundResponse };

//sales UI
// Utility functions for sales data backup and restoration
let salesBackup = [];

export function backupSalesData() {
	return getAllSales().then(() => {
		return cy.get("@salesResponse").then((response) => {
			if (response.status === 200 && response.body) {
				salesBackup = response.body;
				cy.log(`Backed up ${salesBackup.length} sales records`);
			}
		});
	});
}

export function restoreSalesData() {
	cy.log(`Restoring ${salesBackup.length} sales records`);
	
	if (salesBackup.length === 0) {
		return cy.wrap(null);
	}
	
	const baseUrl = ensureBaseUrl();
	
	// Restore each sale using the correct endpoint format
	const restorePromises = salesBackup.map((sale) => {
		const plantId = sale.plant?.id || sale.plantId;
		
		if (!plantId) {
			cy.log(`Warning: No plantId found for sale, skipping`);
			return cy.wrap(null);
		}
		
		// Create sale parameters as query string
		const saleParams = {
			quantity: sale.quantity,
			totalPrice: sale.totalPrice,
			soldAt: sale.soldAt
		};
		
		return cy.get("@authToken").then((token) => {
			return cy.request({
				method: "POST",
				url: `${baseUrl}/api/sales/plant/${plantId}`,
				headers: {
					Authorization: `Bearer ${token}`
				},
				qs: saleParams,
				failOnStatusCode: false
			}).then((response) => {
				if (response.status === 201 || response.status === 200) {
					cy.log(`✓ Restored sale for plant ${plantId}`);
				} else {
					cy.log(`✗ Failed to restore plant ${plantId}: ${response.status} - ${JSON.stringify(response.body)}`);
				}
			});
		});
	});
	
	return Cypress.Promise.all(restorePromises);
}

export function deleteAllSales() {
	return getAllSales().then(() => {
		return cy.get("@salesResponse").then((response) => {
			if (response.status === 200 && response.body && response.body.length > 0) {
				const deletePromises = response.body.map((sale) => 
					deleteSale(sale.id)
				);
				return Cypress.Promise.all(deletePromises);
			}
		});
	});
}

// Create a test sale for UI testing
export function createTestSale() {
	// Use a valid plant ID (assuming plant ID 1 exists, adjust if needed)
	const plantId = 1;
	const payload = {
		quantity: 5,
		totalPrice: 50.00,
		soldAt: new Date().toISOString()
	};
	
	return salesRequest({ 
		method: "POST", 
		path: `/api/sales/plant/${plantId}`, 
		qs: payload, 
		alias: "testSaleResponse",
		failOnStatusCode: false
	}).then(() => {
		return cy.get("@testSaleResponse").then((response) => {
			if (response.status === 201 || response.status === 200) {
				cy.log(`Test sale created with ID: ${response.body.id}`);
				return cy.wrap(response.body).as("testSale");
			} else {
				cy.log(`Failed to create test sale: ${response.status} - ${JSON.stringify(response.body)}`);
				throw new Error(`Failed to create test sale: ${response.status}`);
			}
		});
	});
}

// Sale_Admin_API_16 helper functions
// Step 1: Get all plants and select one with stock > minStock
export function selectPlantWithStockGreaterThan(minStock = 2) {
	const baseUrl = ensureBaseUrl();
	const url = `${baseUrl}/api/plants`;
	
	return cy.get("@authToken").then((token) => {
		if (!token) {
			throw new Error(AUTH_TOKEN_ERROR);
		}
		return cy
			.request({
				method: "GET",
				url,
				headers: {
					Authorization: `Bearer ${token}`,
				},
				failOnStatusCode: false,
			})
			.as("allPlantsResponse")
			.then((response) => {
				expect(response.status, "GET /api/plants status").to.equal(200);
				
				let plants = response.body;
				
				// Handle paginated response
				if (plants && plants.content && Array.isArray(plants.content)) {
					plants = plants.content;
				}
				
				if (!plants || !Array.isArray(plants) || plants.length === 0) {
					throw new Error("No plants found in the system");
				}
				
				cy.log(`Retrieved ${plants.length} plants from API`);
				
				// Log all plants with their quantity
				cy.log("=== All Plants with Quantity ===");
				plants.slice(0, 10).forEach((p, index) => {
					const logMsg = `${index + 1}. ID:${p.id} | Name:${p.name} | Quantity:${p.quantity}`;
					cy.log(logMsg);
				});
				cy.log("===========================");
				
				// Filter plants with quantity > minStock
				const eligiblePlants = plants.filter(p => {
					const hasQuantity = p.quantity !== undefined && p.quantity !== null;
					const quantityValue = Number(p.quantity);
					return hasQuantity && !isNaN(quantityValue) && quantityValue > minStock;
				});
				
				cy.log(`Found ${eligiblePlants.length} plants with quantity > ${minStock}`);
				
				if (eligiblePlants.length === 0) {
					const quantitySummary = plants.slice(0, 5).map(p => `ID:${p.id} Qty:${p.quantity}`).join(", ");
					cy.log(`First 5 plants: ${quantitySummary}`);
					throw new Error(`No plants with quantity > ${minStock}. Total plants: ${plants.length}`);
				}
				
				// Select first eligible plant
				const selectedPlant = eligiblePlants[0];
				cy.log(`✓ Selected Plant ID: ${selectedPlant.id}, Name: ${selectedPlant.name}, Quantity: ${selectedPlant.quantity}`);
				
				// Store plant details
				cy.wrap(selectedPlant.id).as("selectedPlantId");
				cy.wrap(Number(selectedPlant.quantity)).as("initialStock");
				cy.wrap(selectedPlant).as("selectedPlant");
			});
	});
}

// Step 2: Create sale and store response
export function createSaleAndVerify(quantity) {
	return cy.get("@selectedPlantId").then((plantId) => {
		return cy.get("@initialStock").then((initialStock) => {
			cy.log(`Creating sale: Plant ID ${plantId}, Quantity ${quantity}, Initial Stock ${initialStock}`);
			cy.wrap(quantity).as("saleQuantity");
			
			// Create the sale
			return sellPlant(plantId, quantity, "saleCreationResponse");
		});
	});
}

// Step 3: Validate sale creation response
export function validateSaleCreationSuccess(response) {
	expect(response.status, "Sale creation status").to.equal(201);
	expect(response.body, "Response body").to.exist;
	expect(response.body.id, "Sale ID").to.exist;
	expect(response.body.quantity, "Quantity").to.exist;
	expect(response.body.totalPrice, "Total Price").to.exist;
	expect(response.body.soldAt, "Sold At timestamp").to.exist;
	
	cy.log(`✓ Sale created successfully - ID: ${response.body.id}, Quantity: ${response.body.quantity}, Price: ${response.body.totalPrice}`);
	cy.wrap(response.body.id).as("createdSaleId");
}

// Step 4: Verify stock reduction
export function validateStockReduction() {
	return cy.get("@selectedPlantId").then((plantId) => {
		return cy.get("@initialStock").then((initialStock) => {
			return cy.get("@saleQuantity").then((quantity) => {
				const baseUrl = ensureBaseUrl();
				const url = `${baseUrl}/api/plants/${plantId}`;
				
				return cy.get("@authToken").then((token) => {
					return cy
						.request({
							method: "GET",
							url,
							headers: {
								Authorization: `Bearer ${token}`,
							},
							failOnStatusCode: false,
						})
						.then((response) => {
							expect(response.status, "GET plant status").to.equal(200);
							
							const currentQuantity = Number(response.body.quantity);
							const expectedQuantity = initialStock - quantity;
							
							cy.log(`Quantity verification: Initial=${initialStock}, Sold=${quantity}, Expected=${expectedQuantity}, Current=${currentQuantity}`);
							
							expect(currentQuantity, "Quantity should be reduced").to.equal(expectedQuantity);
							cy.log(`✓ Quantity successfully reduced from ${initialStock} to ${currentQuantity}`);
						});
				});
			});
		});
	});
}
// Cleanup: Delete sale and restore plant quantity
export function cleanupSaleTestData() {
	return cy.get("@createdSaleId").then((saleId) => {
		return cy.get("@selectedPlantId").then((plantId) => {
			return cy.get("@initialStock").then((initialStock) => {
				const baseUrl = ensureBaseUrl();
				
				// Delete the sale
				return deleteSale(saleId).then((deleteResponse) => {
					cy.log(`✓ Sale ${saleId} deleted successfully`);
					
					// Get the current plant data first
					return cy.get("@authToken").then((token) => {
						return cy
							.request({
								method: "GET",
								url: `${baseUrl}/api/plants/${plantId}`,
								headers: {
									Authorization: `Bearer ${token}`,
								},
								failOnStatusCode: false,
							})
							.then((getResponse) => {
								// Update the plant with restored quantity
								const plantData = getResponse.body;
								plantData.quantity = initialStock;
								
								return cy
									.request({
										method: "PUT",
										url: `${baseUrl}/api/plants/${plantId}`,
										body: plantData,
										headers: {
											Authorization: `Bearer ${token}`,
										},
										failOnStatusCode: false,
									})
									.then((updateResponse) => {
										cy.log(`✓ Plant ${plantId} quantity restored to ${initialStock} (Status: ${updateResponse.status})`);
										if (updateResponse.status !== 200) {
											cy.log(`⚠ Warning: Update returned status ${updateResponse.status}`);
										}
									});
							});
					});
				});
			});
		});
	});
}

export function validateForbiddenAccessWithCleanup(response) {
	const status = response.status;
	cy.log(`Actual status: ${status}`);
	
	// If status is 201, cleanup first before failing the assertion
	if (status === 201) {
		cy.log("Sale was created (201) - cleanup required before assertion fails");
		
		if (response.body && response.body.id) {
			const saleId = response.body.id;
			
			// Import apiLoginAsAdmin at runtime to avoid circular dependency
			const { apiLoginAsAdmin } = require('../../e2e/preconditions/login');
			
			// Perform cleanup
			return cy.get('@selectedPlantId').then((plantId) => {
				return cy.get('@initialStock').then((initialStock) => {
					cy.log(`Cleanup: Sale ID=${saleId}, Plant ID=${plantId}, Initial Stock=${initialStock}`);
					
					// Login as admin
					return apiLoginAsAdmin().then(() => {
						cy.log("Logged in as admin for cleanup");
						
						// Set aliases
						cy.wrap(saleId).as("createdSaleId");
						cy.wrap(plantId).as("selectedPlantId");
						cy.wrap(initialStock).as("initialStock");
						
						// Execute cleanup
						return cleanupSaleTestData().then(() => {
							cy.log("CLEANUP COMPLETED");
						});
					});
				});
			}).then(() => {
				// Now fail the assertion after cleanup
				expect(status, "Status code after cleanup").to.equal(403);
			});
		}
	}
	
	// Normal assertion for 403
	expect(status).to.equal(403);
}

export function validateForbiddenDeleteAccessWithRestore(response) {
	const status = response.status;
	cy.log(`Delete attempt status: ${status}`);
	
	// If status is 200 or 204, sale was deleted - restore before failing
	if (status === 200 || status === 204) {
		cy.log("Sale was deleted - Restoring before assertion fails");
		
		return cy.get('@saleDataForRestore').then((saleData) => {
			const plantId = saleData.plant?.id || saleData.plantId;
			const quantity = saleData.quantity;
			const deletedSaleId = saleData.id;
			const originalSoldDate = saleData.soldDate;
			
			cy.log(`Restoring: ID=${deletedSaleId}, Plant=${plantId}, Qty=${quantity}, Date=${originalSoldDate}`);
			
			// Import apiLoginAsAdmin at runtime to avoid circular dependency
			const { apiLoginAsAdmin } = require('../../e2e/preconditions/login');
			
			// Login as admin to restore
			return apiLoginAsAdmin().then(() => {
				cy.log("✓ Logged in as admin");
				const baseUrl = ensureBaseUrl();
				
				return cy.get("@authToken").then((adminToken) => {
					// Get current plant stock
					return cy.request({
						method: "GET",
						url: `${baseUrl}/api/plants/${plantId}`,
						headers: { Authorization: `Bearer ${adminToken}` },
						failOnStatusCode: false,
					}).then((plantResponse) => {
						if (plantResponse.status === 200) {
							const currentStock = plantResponse.body.quantity;
							const newStock = currentStock + quantity;
							cy.log(`Plant stock: ${currentStock} → ${newStock}`);
							
							// Update plant stock
							return cy.request({
								method: "PUT",
								url: `${baseUrl}/api/plants/${plantId}`,
								headers: { Authorization: `Bearer ${adminToken}` },
								body: { ...plantResponse.body, quantity: newStock },
								failOnStatusCode: false,
							}).then((updateResponse) => {
								if (updateResponse.status === 200) {
									cy.log("✓ Plant stock updated");
									
									// Recreate the sale
									return cy.request({
										method: "POST",
										url: `${baseUrl}/api/sales/plant/${plantId}?quantity=${quantity}`,
										headers: { Authorization: `Bearer ${adminToken}` },
										failOnStatusCode: false,
									}).then((createResponse) => {
										if (createResponse.status === 201) {
											const newSaleId = createResponse.body.id;
											cy.log(`✓ Sale created (ID: ${newSaleId})`);
											
											// Update the sale with original date
											return cy.request({
												method: "PUT",
												url: `${baseUrl}/api/sales/${newSaleId}`,
												headers: { Authorization: `Bearer ${adminToken}` },
												body: {
													...createResponse.body,
													soldDate: originalSoldDate
												},
												failOnStatusCode: false,
											}).then((dateUpdateResponse) => {
												if (dateUpdateResponse.status === 200) {
													cy.log(`SALE RESTORED (ID: ${newSaleId}, Date: ${originalSoldDate})`);
												} else {
													cy.log(`Date update failed (${dateUpdateResponse.status}), but sale created`);
												}
											});
										} else {
											cy.log(`Restore failed: ${createResponse.status}`);
										}
									});
								} else {
									cy.log(`Plant update failed: ${updateResponse.status}`);
								}
							});
						} else {
							cy.log(`Could not get plant: ${plantResponse.status}`);
						}
					});
				});
			});
		}).then(() => {
			// Now fail the assertion after restore
			expect(status, "Status code after restore").to.equal(403);
		});
	}
	
	// Normal assertion for 403
	expect(status).to.equal(403);
}