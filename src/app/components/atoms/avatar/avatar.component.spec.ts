import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';
import { By } from '@angular/platform-browser';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render image when imageUrl is provided', () => {
    fixture.componentRef.setInput('imageUrl', 'https://test-url.jpg');
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('.bocc-avatar-img'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.src).toContain('https://test-url.jpg');
  });

  it('should render placeholder svg when imageUrl is null', () => {
    fixture.componentRef.setInput('imageUrl', null);
    fixture.detectChanges();
    const svg = fixture.debugElement.query(By.css('svg.bocc-avatar-placeholder'));
    expect(svg).toBeTruthy();
  });

  it('should show/hide content block based on isExpanded input', () => {
    fixture.componentRef.setInput('isExpanded', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.bocc-avatar-content'))).toBeTruthy();

    fixture.componentRef.setInput('isExpanded', false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.bocc-avatar-content'))).toBeFalsy();
  });

  it('should show subtitle above title and render correct text', () => {
    fixture.componentRef.setInput('isExpanded', true);
    fixture.componentRef.setInput('titleText', 'Juan Perez');
    fixture.componentRef.setInput('subtitleText', 'Desarrollador');
    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('.bocc-avatar-content'));
    const children = content.nativeElement.children;

    expect(children.length).toBe(2);
    expect(children[0].classList).toContain('bocc-avatar-subtitle');
    expect(children[0].textContent).toContain('Desarrollador');
    expect(children[1].classList).toContain('bocc-avatar-title');
    expect(children[1].textContent).toContain('Juan Perez');
  });
})
