import {FormGroup} from '@angular/forms';

/**
 * 如果表单的状态是invalid，则标记为dirty。
 *
 * 如果全部标记为dirty，并调用updateValueAndValidity方法，有些异步验证器也可能会执行，
 * 导致表单处于pending状态，不能通过
 * if(form.valid){}提交表单
 */
export const formControlMarkAsDirty = (form: FormGroup) => {
  for (const i in form.controls) {
    if (!form.controls[i].valid) {
      form.controls[i].markAsDirty();
      form.controls[i].updateValueAndValidity();
    }
  }
};
