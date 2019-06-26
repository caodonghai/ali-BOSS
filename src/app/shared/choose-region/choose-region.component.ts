import {Component, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-choose-region',
  templateUrl: './choose-region.component.html',
  styleUrls: ['./choose-region.component.css']
})
export class ChooseRegionComponent implements OnInit {
  @Input() show = false;
  @Input() showMask = true;

  constructor() {
  }

  ngOnInit() {
  }

}
