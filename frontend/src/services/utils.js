export const url = {
    home: () => '/',

    catalog: () => '/product',

    category: (category) => `/product/catalog/${category.slug}`,

    product: (product) => `/product/${product.slug}`,
};

export function getCategoryParents(category) {
    return category.parent ? [...getCategoryParents(category.parent), category.parent] : [];
}
