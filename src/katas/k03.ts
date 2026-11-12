export type Permission = 'edit_products' | 'manage_users' | 'view_reports';


export interface User {
    id: string;
    email: string;
    role: 'admin' | 'user'
}

export interface Admin extends User {
    role: 'admin';
    permissions: Array<Permission>
}

export function canEditProducts (user: User | Admin): boolean{
    if(user.role === 'admin' && 'permissions' in user){
        return user.permissions.includes('edit_products');
    }
    return false;
}
