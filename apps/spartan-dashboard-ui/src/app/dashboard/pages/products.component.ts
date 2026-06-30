import { Component, ChangeDetectionStrategy } from '@angular/core';

interface Product {
  name: string;
  category: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-products',
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Products</h1>
        <button class="btn-primary">Add Product</button>
      </div>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            @for (product of products; track product.name) {
              <tr>
                <td>{{ product.name }}</td>
                <td><span class="badge">{{ product.category }}</span></td>
                <td>\${{ product.price.toFixed(2) }}</td>
                <td><span class="stock" [class.low]="product.stock < 20">{{ product.stock }}</span></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .btn-primary { padding: 8px 16px; background: #0f172a; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; padding: 12px 16px; font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
    .table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; }
    .badge { padding: 2px 8px; border-radius: 4px; background: #e2e8f0; font-size: 0.8rem; }
    .stock { font-weight: 600; color: #16a34a; }
    .stock.low { color: #dc2626; }
  `],
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
