import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptionSearchComponent } from './caption-search.component';

describe('CaptionSearchComponent', () => {
  let component: CaptionSearchComponent;
  let fixture: ComponentFixture<CaptionSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptionSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
