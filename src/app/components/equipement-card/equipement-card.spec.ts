import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipementCard } from './equipement-card';

describe('EquipementCard', () => {
  let component: EquipementCard;
  let fixture: ComponentFixture<EquipementCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipementCard],
    }).compileComponents();

    fixture = TestBed.createComponent(EquipementCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
