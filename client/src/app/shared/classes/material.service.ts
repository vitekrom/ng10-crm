import { ElementRef } from '@angular/core';

declare var M;

export interface MateriaInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
}

export interface MaterialDatepicker extends MateriaInstance {
  date?: Date;
}

export class MaterialService {
  static toast(message: string) {
    M.toast({
      html: message,
      classes: 'rounded',
      displayLength: 1500,
      outDuration: 300,
    });
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static updateTextInputs() {
    M.updateTextFields();
  }

  static initModal(ref: ElementRef): MateriaInstance {
    return M.Modal.init(ref.nativeElement);
  }

  static initTooltip(ref: ElementRef): MateriaInstance {
    return M.Tooltip.init(ref.nativeElement);
  }

  static initDatePicker(
    ref: ElementRef,
    onClose: () => void
  ): MaterialDatepicker {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose,
    });
  }

}
