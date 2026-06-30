import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the heading', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Users');
  });

  it('should render an Add User button', () => {
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Add User');
  });

  it('should render all users in the table', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(component.users.length);
  });

  it('should display user names', () => {
    const el = fixture.nativeElement as HTMLElement;
    for (const u of component.users) {
      expect(el.textContent).toContain(u.name);
    }
  });

  it('should render badges for each role and status', () => {
    const badges = fixture.nativeElement.querySelectorAll('[hlmBadge]');
    expect(badges.length).toBe(component.users.length * 2);
  });
});
