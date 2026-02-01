const BASE_URL_ERROR = "Missing BASE_URL env variable. Configure it before running API tests.";
const AUTH_TOKEN_ERROR = "Missing @authToken. Call an API login helper before invoking plant APIs.";

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

function plantRequest({
    method = "GET",
    path,
    body,
    qs,
    headers = {},
    alias = "plantsResponse",
    failOnStatusCode = false,
}) {
    const baseUrl = ensureBaseUrl();
    const url = `${baseUrl}${normalizePath(path)}`;

    // Reuse the auth token alias set during login helpers.
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

export function getAllPlants(responseAlias = "plantsResponse") {
    return plantRequest({ path: "/api/plants", alias: responseAlias });
}

export function getPlantById(plantId, responseAlias = "plantResponse") {
    if (!plantId && plantId !== 0) {
        throw new Error("plantId is required to fetch a plant.");
    }
    return plantRequest({ path: `/api/plants/${plantId}`, alias: responseAlias });
}

export function updatePlant(plantId, payload, responseAlias = "updatePlantResponse") {
    if (!plantId && plantId !== 0) {
        throw new Error("plantId is required to update a plant.");
    }
    if (!payload) {
        throw new Error("payload is required when updating a plant.");
    }
    return plantRequest({ method: "PUT", path: `/api/plants/${plantId}`, body: payload, alias: responseAlias });
}

export function deletePlant(plantId, responseAlias = "deletePlantResponse") {
    if (!plantId && plantId !== 0) {
        throw new Error("plantId is required to delete a plant.");
    }
    return plantRequest({ method: "DELETE", path: `/api/plants/${plantId}`, alias: responseAlias });
}

export function createPlant(payload, responseAlias = "createPlantResponse") {
    if (!payload) {
        throw new Error("payload is required when creating a plant.");
    }
    if (!payload.categoryId) {
        throw new Error("payload.categoryId is required for creating a plant.");
    }
    return plantRequest({ method: "POST", path: `/api/plants/category/${payload.categoryId}`, body: payload, alias: responseAlias });
}

export function searchPlants({
    page,
    size,
    name,
    category,
    sortBy,
    order,
    sortField,
    sortDir,
    responseAlias = "plantsPageResponse",
} = {}) {
    const query = {};
    if (page !== undefined) query.page = page;
    if (size !== undefined) query.size = size;
    if (name !== undefined) query.name = name;
    if (category !== undefined) query.categoryId = category; // Note: API expects 'categoryId' not 'category' for filtering in paged endpoint

    // Handle string sorting (convert sortBy/order to Spring Pageable sort)
    if (sortBy !== undefined) {
        const direction = order ? order.toLowerCase() : "asc";
        query.sort = `${sortBy},${direction}`;
    } else if (sortField !== undefined) {
        const direction = sortDir ? sortDir.toLowerCase() : "asc";
        query.sort = `${sortField},${direction}`;
    }

    return plantRequest({
        path: "/api/plants/paged",
        qs: query,
        alias: responseAlias,
    });
}

export function getPlantsByCategory(categoryId, responseAlias = "plantsByCategoryResponse") {
    if (!categoryId) {
        throw new Error("categoryId is required for fetching plants by category.");
    }
    return plantRequest({
        path: `/api/plants/category/${categoryId}`,
        alias: responseAlias
    });
}
