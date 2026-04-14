import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent, AvatarStatus } from './avatar.component';
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

  // --- Host Class Tests ---
  it('should apply size classes to host', () => {
    fixture.componentRef.setInput('size', '16');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('bocc-size-16');

    fixture.componentRef.setInput('size', '24');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('bocc-size-24');

    fixture.componentRef.setInput('size', '32');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('bocc-size-32');
  });

  it('should apply status classes to host', () => {
    const statuses: AvatarStatus[] = ['disponible', 'ocupado', 'no-disponible', 'desconectado', 'none'];
    statuses.forEach(status => {
      fixture.componentRef.setInput('status', status);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain(`bocc-status-${status}`);
    });
  });

  // --- Image Mode Tests ---
  it('should render image when imageMode is "image" and imageUrl is provided', () => {
    fixture.componentRef.setInput('imageMode', 'image');
    fixture.componentRef.setInput('imageUrl', 'https://test-url.jpg');
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('.bocc-avatar-img'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.src).toContain('https://test-url.jpg');
  });

  it('should render initials when imageMode is "initials"', () => {
    fixture.componentRef.setInput('imageMode', 'initials');
    fixture.componentRef.setInput('initialsText', 'CQ');
    fixture.detectChanges();
    const initials = fixture.debugElement.query(By.css('.bocc-avatar-initials'));
    expect(initials.nativeElement.textContent).toBe('CQ');
  });

  it('should render placeholder svg when imageMode is "placeholder" or "none"', () => {
    fixture.componentRef.setInput('imageMode', 'placeholder');
    fixture.detectChanges();
    let svg = fixture.debugElement.query(By.css('svg'));
    expect(svg).toBeTruthy();

    fixture.componentRef.setInput('imageMode', 'none');
    fixture.detectChanges();
    svg = fixture.debugElement.query(By.css('svg'));
    expect(svg).toBeTruthy();
  });

  // --- Status Indicator Tests ---
  it('should show status indicator if status is not "none"', () => {
    fixture.componentRef.setInput('status', 'disponible');
    fixture.detectChanges();
    const statusDiv = fixture.debugElement.query(By.css('.bocc-avatar-status'));
    expect(statusDiv).toBeTruthy();
  });

  it('should hide status indicator if status is "none"', () => {
    fixture.componentRef.setInput('status', 'none');
    fixture.detectChanges();
    const statusDiv = fixture.debugElement.query(By.css('.bocc-avatar-status'));
    expect(statusDiv).toBeFalsy();
  });

  // --- Content Visibility & Order Tests ---
  it('should show/hide content block', () => {
    fixture.componentRef.setInput('showContent', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.bocc-avatar-content'))).toBeTruthy();

    fixture.componentRef.setInput('showContent', false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.bocc-avatar-content'))).toBeFalsy();
  });

  it('should show subtitle above title and respect visibility toggles', () => {
    fixture.componentRef.setInput('showContent', true);
    fixture.componentRef.setInput('titleText', 'Main Title');
    fixture.componentRef.setInput('subtitleText', 'Subtitle Text');
    fixture.componentRef.setInput('showTitle', true);
    fixture.componentRef.setInput('showSubtitle', true);
    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('.bocc-avatar-content'));
    const children = content.nativeElement.children;

    expect(children.length).toBe(2);
    // Verified fix: Subtitle is now FIRST in the template
    expect(children[0].classList).toContain('bocc-avatar-subtitle');
    expect(children[1].classList).toContain('bocc-avatar-title');

    // Test specific visibility toggle for title
    fixture.componentRef.setInput('showTitle', false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.bocc-avatar-title'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.bocc-avatar-subtitle'))).toBeTruthy();

    // Test specific visibility toggle for subtitle
    fixture.componentRef.setInput('showTitle', true);
    fixture.componentRef.setInput('showSubtitle', false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.bocc-avatar-title'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.bocc-avatar-subtitle'))).toBeFalsy();
  });
});
