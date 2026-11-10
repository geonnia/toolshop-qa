export type Currency = 'EUR' | 'CZK' | 'USD';

const twoDecimals = new Intl.NumberFormat('en-US',
     {
        minimumFractionDigits: 2,
         maximumFractionDigits: 2,
          useGrouping: false
        }
    );


export function formatPrice(amount: number, currency: Currency): string {
    if(!Number.isFinite(amount) || amount < 0){
        throw new Error(`Invalid amout: ${amount}`);
    }

    return `${twoDecimals.format(amount)} ${currency}`;
}