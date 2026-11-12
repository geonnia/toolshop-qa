import { test, expect } from '@playwright/test';
import { type User, type Admin, canEditProducts } from '../../src/katas/k03';

export type TestCase = {
    description: string;
    user: User | Admin;
}

const usersWithoutEditPermission: Array<TestCase> = [
    {
        description: 'user without permissions',
        user: {
            id: '001',
            email: 'test@gmail.com',
            role: 'user'
        }
    },
    {
        description: 'admin without permissions',
        user: {
            id: '002',
            email: 'test02@gmail.com',
            role: 'admin'
        }
    },
    {
        description: 'admin with empty permissions',
        user: {
            id: '003',
            email: 'test03@gmail.com',
            role: 'admin',
            permissions: []
        }
    },
    {
        description: 'admin without "edit_products" in permissions',
        user: {
            id: '004',
            email: 'test04@gmail.com',
            role: 'admin',
            permissions: ['view_reports', 'manage_users']
        }
    }
];

const usersWithEditPermission: Array<TestCase> = [
    {
        description: 'with manage_users and edit_products permissions',
        user: {
            id: '005',
            email: 'test05@gmail.com',
            role: 'admin',
            permissions: ['manage_users', 'edit_products']
        }
    },
    {
        description: 'with edit_products permission only',
        user: {
            id: '006',
            email: 'test06@gmail.com',
            role: 'admin',
            permissions: ['edit_products']
        }
    }
];

for (const userCase of usersWithEditPermission) {
    test(`Check case with admin ${userCase.description} can edit products`, () => {
        expect(canEditProducts(userCase.user)).toBe(true);
    })
}

for (const userCase of usersWithEditPermission) {
    test(`Check case with user ${userCase.description} can't edit products`, () => {
        expect(canEditProducts({ ...userCase.user, role: 'user' })).toBe(false);
    })
}

for (const userCase of usersWithoutEditPermission) {
    test(`Check case with ${userCase.description} can't edit products`, () => {
        expect(canEditProducts(userCase.user)).toBe(false);
    })
}



