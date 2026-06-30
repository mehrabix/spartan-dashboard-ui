import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmTableImports } from '@spartan-ng/helm/table';

interface Product {
  name: string;
  category: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-products',
  imports: [HlmCard, HlmCardContent, HlmButton, HlmBadge, ...HlmTableImports],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold tracking-tight">Products</h1>
        <button hlmBtn size="sm">Add Product</button>
      </div>

      <div hlmCard>
        <div hlmCardContent class="p-0">
          <div hlmTableContainer>
            <table hlmTable>
              <thead hlmTHead>
                <tr hlmTr>
                  <th hlmTh>Product</th>
                  <th hlmTh>Category</th>
                  <th hlmTh>Price</th>
                  <th hlmTh>Stock</th>
                </tr>
              </thead>
              <tbody hlmTBody>
                @for (product of products; track product.name) {
                  <tr hlmTr>
                    <td hlmTd class="font-medium">{{ product.name }}</td>
                    <td hlmTd>
                      <span hlmBadge variant="secondary" class="text-xs">{{ product.category }}</span>
                    </td>
                    <td hlmTd>\${{ product.price.toFixed(2) }}</td>
                    <td hlmTd>
                      <span [class.text-red-600]="product.stock < 20" [class.text-green-600]="product.stock >= 20" class="font-medium">
                        {{ product.stock }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  readonly products: Product[] = [
    { name: 'Wireless Headphones', category: 'Electronics', price: 149.99, stock: 45 },
    { name: 'Running Shoes', category: 'Footwear', price: 89.99, stock: 120 },
    { name: 'Coffee Maker', category: 'Home', price: 59.99, stock: 8 },
    { name: 'Backpack', category: 'Accessories', price: 79.99, stock: 67 },
    { name: 'Desk Lamp', category: 'Home', price: 34.99, stock: 3 },
    { name: 'Yoga Mat', category: 'Sports', price: 24.99, stock: 200 },
    { name: 'Bluetooth Speaker', category: 'Electronics', price: 129.99, stock: 0 },
    { name: 'Water Bottle', category: 'Accessories', price: 19.99, stock: 340 },
  ];
}
