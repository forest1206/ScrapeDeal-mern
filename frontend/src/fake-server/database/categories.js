import { makeIdGenerator } from '../utils';

const getId = makeIdGenerator();

const categoriesDef = [
    {
        name: 'Instruments',
        slug: 'instruments',
        items: 272,
    },
    {
        name: 'Electronics',
        slug: 'electronics',
        items: 54,
    },
    {
        name: 'Computers',
        slug: 'computers',
        items: 421,
    },
    {
        name: 'Automotive',
        slug: 'automotive',
        items: 182,
    },
    {
        name: 'Furniture & Appliances',
        slug: 'furniture-appliances',
        items: 15,
    },
    {
        name: 'Music & Books',
        slug: 'music-books',
        items: 89,
    },
    {
        name: 'Health & Beauty',
        slug: 'health-beauty',
        items: 201,
    },
];

function walkTree(defs, parent = null) {
    let list = [];
    const tree = defs.map((def) => {
        const category = {
            id: getId(),
            name: def.name,
            slug: def.slug,
            image: def.image || null,
            items: def.items || 0,
            customFields: {},
            parent,
            children: [],
        };

        const [childrenTree, childrenList] = walkTree(def.children || [], category);

        category.children = childrenTree;
        list = [...list, category, ...childrenList];

        return category;
    });

    return [tree, list];
}

export function prepareCategory(category, depth) {
    let children;

    if (depth && depth > 0) {
        children = category.children.map((x) => prepareCategory(x, depth - 1));
    }

    return JSON.parse(JSON.stringify({
        ...category,
        parent: category.parent ? prepareCategory(category.parent) : null,
        children,
    }));
}

export const [categoriesTreeData, categoriesListData] = walkTree(categoriesDef);
