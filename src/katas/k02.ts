export type Product = {
    id: string,
    name: string;
    price: number,
    inStock: boolean,
    tags?: Array<string> 
}

export function isAffordable(product: Product, budget: number): boolean{
    return product.inStock && product.price <= budget;
}