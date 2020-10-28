import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  MateriaInstance,
  MaterialService,
} from 'src/app/shared/classes/material.service';
import { Position } from 'src/app/shared/interfaces';
import { PositionsService } from 'src/app/shared/services/positions.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css'],
})
export class PositionsFormComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  positions: Position[] = [];
  loading = false;
  modal: MateriaInstance;
  form: FormGroup;
  positionId = null;

  constructor(private positionsService: PositionsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)]),
    });

    this.loading = true;
    this.positionsService.fetch(this.categoryId).subscribe((positions) => {
      this.positions = positions;
      this.loading = false;
    });
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId,
    };

    const completed = () => {
      this.modal.close();
      this.form.reset({
        name: '',
        cost: 1,
      });
      this.form.enable();
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition).subscribe(
        (position) => {
          const idx = this.positions.findIndex((p) => p._id === position._id);
          this.positions[idx] = position;
          MaterialService.toast('Изменения сохранены');
        },
        (error) => {
          MaterialService.toast(error.error.message);
        },
        completed
      );
    } else {
      this.positionsService.create(newPosition).subscribe(
        (position) => {
          MaterialService.toast('Позиция добавлена');
          this.positions.push(position);
        },
        (error) => {
          MaterialService.toast(error.error.message);
        },
        completed
      );
    }
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost,
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset({
      name: null,
      cost: 1,
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onCancel() {
    this.modal.close();
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Удалить позицию "${position.name}"?`);

    if (decision) {
      this.positionsService.remove(position).subscribe(
        (response) => {
          const idx = this.positions.findIndex((p) => p._id === position._id);
          this.positions.splice(idx, 1);
          MaterialService.toast(response.message);
        },
        (error) => {
          MaterialService.toast(error.error.message);
        },
        () => { }
      );
    }
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy() {
    this.modal.destroy();
  }
}
