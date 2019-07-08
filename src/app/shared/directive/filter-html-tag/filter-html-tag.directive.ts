import {AfterViewInit, Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appFilterHtmlTag]'
})
export class FilterHtmlTagDirective implements AfterViewInit {

  constructor(private el: ElementRef) {

  }

  ngAfterViewInit() {
    const target = this.el.nativeElement;
    const previousContent = target.innerText;
    const newContent = previousContent.replace(/<\/?[^>]*>/g, '');
    requestAnimationFrame(() => {
      target.innerText = newContent;
    });
  }

}
