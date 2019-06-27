import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css']
})
export class BackButtonComponent implements OnInit {
  @Input() step = -1;
  @Input() type = 'default';
  @Input() size = 'default';

  constructor() {
  }

  ngOnInit() {
  }

  goBack() {
    history.go(this.step);
  }
}
