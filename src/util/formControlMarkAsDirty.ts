import {FormGroup} from '@angular/forms';

export const formControlMarkAsDirty = (form: FormGroup) => {
  for (const i in form.controls) {
    if (!form.controls[i].valid) {
      form.controls[i].markAsDirty();
      form.controls[i].updateValueAndValidity();
    }
  }
};
