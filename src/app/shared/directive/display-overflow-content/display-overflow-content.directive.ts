import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appDisplayOverflowContent]'
})
export class DisplayOverflowContentDirective {
  private target;

  constructor(private el: ElementRef) {
    this.target = this.el.nativeElement;
  }

  @HostListener('mouseenter') onMouseEnter() {
    const clientWidth = this.target.clientWidth;
    const scrollWidth = this.target.scrollWidth;
    if (clientWidth < scrollWidth && !this.target.title) {
      this.target.title = this.target.innerText;
    }
  }

  @HostListener('mouseleave') onMouseLeave() {

  }

}
