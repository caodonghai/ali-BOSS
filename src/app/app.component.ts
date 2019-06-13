import {Component, ElementRef, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private el: ElementRef) {

  }

  ngOnInit(): void {
    const preloader = this.el.nativeElement.parentNode.querySelector('.preloader');
    preloader.className += ' preloader-hidden-add preloader-hidden-add-active';
    setTimeout(() => {
      preloader.className += ' preloader-hidden';
    }, 750); // 加载动画变为透明用时750ms，所以750ms后移除该动画
  }
}
