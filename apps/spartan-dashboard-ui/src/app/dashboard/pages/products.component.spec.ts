import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the heading', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Products');
  });

  it('should render an Add Product button', () => {
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Add Product');
  });

  it('should render all products in the table', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(component.products.length);
  });

  it('should display product names', () => {
    const el = fixture.nativeElement as HTMLElement;
    for (const p of component.products) {
      expect(el.textContent).toContain(p.name);
    }
  });

  it('should format prices with dollar sign', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('$149.99');
    expect(el.textContent).toContain('$89.99');
  });

  it('should show badge for each category', () => {
    const badges = fixture.nativeElement.querySelectorAll('[hlmBadge]');
    expect(badges.length).toBe(component.products.length);
  });

  it('should highlight low stock items', () => {
    const lowStock = fixture.nativeElement.querySelectorAll('.text-red-600');
    expect(lowStock.length).toBeGreaterThan(0);
  });
});
