import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';
import { By } from '@angular/platform-browser';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  const mockDialogData: ConfirmDialogData = {
    title: 'Test Title',
    message: 'Test Message'
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      imports: [
        MatDialogModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided title', () => {
    const titleElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(titleElement.textContent).toContain(mockDialogData.title);
  });

  it('should display the provided message', () => {
    const messageElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(messageElement.textContent).toContain(mockDialogData.message);
  });

  it('should have a cancel button', () => {
    const cancelButton = fixture.debugElement.query(By.css('button[mat-dialog-close]'));
    expect(cancelButton).toBeTruthy();
    expect(cancelButton.nativeElement.textContent).toContain('Cancel');
  });

  it('should have a delete button', () => {
    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.nativeElement.textContent).toContain('Delete');
  });

  it('should have proper button styling', () => {
    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    const cancelButton = fixture.debugElement.query(By.css('button:not([color="warn"])'));

    expect(deleteButton.attributes['mat-raised-button']).toBeDefined();
    expect(cancelButton.attributes['mat-button']).toBeDefined();
  });

  it('should align actions to the end', () => {
    const actionsElement = fixture.debugElement.query(By.css('mat-dialog-actions'));
    expect(actionsElement.attributes['align']).toBe('end');
  });

  it('should have proper dialog content structure', () => {
    const dialogContent = fixture.debugElement.query(By.css('mat-dialog-content'));
    const contentWrapper = dialogContent.query(By.css('.dialog-content'));

    expect(dialogContent).toBeTruthy();
    expect(contentWrapper).toBeTruthy();
  });
});
