const BASE_URL_ERROR = "Missing BASE_URL env variable. Configure it before running API tests.";
const AUTH_TOKEN_ERROR = "Missing @authToken. Call an API login helper before invoking category APIs.";

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

function categoryRequest({
	method = "GET",
	path,
	body,
	qs,
	headers = {},
	alias = "categoriesResponse",
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

export function getAllCategories(responseAlias = "categoriesResponse") {
	return categoryRequest({ path: "/api/categories", alias: responseAlias });
}

export function getCategoryById(categoryId, responseAlias = "categoryResponse") {
	if (!categoryId && categoryId !== 0) {
		throw new Error("categoryId is required to fetch a category.");
	}
	return categoryRequest({ path: `/api/categories/${categoryId}`, alias: responseAlias });
}

export function updateCategory(categoryId, payload, responseAlias = "updateCategoryResponse") {
	if (!categoryId && categoryId !== 0) {
		throw new Error("categoryId is required to update a category.");
	}
	if (!payload) {
		throw new Error("payload is required when updating a category.");
	}
	return categoryRequest({ method: "PUT", path: `/api/categories/${categoryId}`, body: payload, alias: responseAlias });
}

export function deleteCategory(categoryId, responseAlias = "deleteCategoryResponse") {
	if (!categoryId && categoryId !== 0) {
		throw new Error("categoryId is required to delete a category.");
	}
	return categoryRequest({ method: "DELETE", path: `/api/categories/${categoryId}`, alias: responseAlias });
}

export function createCategory(payload, responseAlias = "createCategoryResponse") {
	if (!payload) {
		throw new Error("payload is required when creating a category.");
	}
	return categoryRequest({ method: "POST", path: "/api/categories", body: payload, alias: responseAlias });
}

export function getCategorySummary(responseAlias = "categorySummaryResponse") {
	return categoryRequest({ path: "/api/categories/summary", alias: responseAlias });
}

export function getAllSubCategories(responseAlias = "subCategoriesResponse") {
	return categoryRequest({ path: "/api/categories/sub-categories", alias: responseAlias });
}

export function searchCategories({
  page,
  size,
  name,
  parentId,
  sortField,
  sortDir,
  responseAlias = "categoriesPageResponse",
} = {}) {
  const query = {};
  if (page !== undefined) query.page = page;
  if (size !== undefined) query.size = size;
  if (name !== undefined) query.name = name;
  if (parentId !== undefined) query.parentId = parentId;
  if (sortField !== undefined) query.sortField = sortField;
  if (sortDir !== undefined) query.sortDir = sortDir;

  return categoryRequest({
    path: "/api/categories/page",
    qs: query,
    alias: responseAlias,
  });
}

export function getMainCategories(responseAlias = "mainCategoriesResponse") {
	return categoryRequest({ path: "/api/categories/main", alias: responseAlias });
}

