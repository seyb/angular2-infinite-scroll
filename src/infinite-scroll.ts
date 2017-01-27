import {
  Directive, ElementRef, Input, Output,
  EventEmitter, OnDestroy, OnInit,
  NgZone
} from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { InfiniteScroller } from './infinite-scroller';
import { InfiniteScrollOptions, InfiniteScrollEvent } from './models';


@Directive({
  selector: '[infinite-scroll]'
})
export class InfiniteScroll implements OnDestroy, OnInit {
  @Output() scrolled = new EventEmitter<InfiniteScrollEvent>();
  @Output() scrolledUp = new EventEmitter<InfiniteScrollEvent>();

  @Input('infiniteScrollDistance') _distanceDown: number = 2;
  @Input('infiniteScrollUpDistance') _distanceUp: number = 1.5;
  @Input('infiniteScrollThrottle') _throttle: number = 300;
  @Input('infiniteScrollDisabled') _disabled: boolean = false;
  @Input('scrollWindow') scrollWindow: boolean = true;
  @Input('immediateCheck') _immediate: boolean = false;
  @Input('horizontal') _horizontal: boolean = false;
  @Input('alwaysCallback') _alwaysCallback: boolean = false;
  @Input()
  set debounce(value: string | boolean) {
    this.throttleType = value === '' || !!value ? 'debounce' : 'throttle';
  }

  private get disabled () {
    return this._disabled;
  }

  private throttleType: string = 'throttle';
  private _infiniteScroller: InfiniteScroller;

  constructor(
    private element: ElementRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const options: InfiniteScrollOptions = {
        distanceDown: this._distanceDown,
        distanceUp: this._distanceUp,
        throttle: this._throttle,
        disabled: this.disabled,
        scrollWindow: this.scrollWindow,
        immediate: this._immediate,
        horizontal: this._horizontal,
        alwaysCallback: this._alwaysCallback,
        throttleType: this.throttleType,
        on: {
          scrollDown: (ev: InfiniteScrollEvent) => this.onScrollDown(ev),
          scrollUp: (ev: InfiniteScrollEvent) => this.onScrollUp(ev)
        }
      };
      this._infiniteScroller = InfiniteScroller.create(this.element.nativeElement, options);
    }
  }

  ngOnDestroy () {
    if (this._infiniteScroller) {
      this._infiniteScroller.destroy();
    }
  }

  onScrollDown(data: InfiniteScrollEvent = { currentScrollPosition: 0 }) {
    this.zone.run(() => this.scrolled.emit(data));
  }

  onScrollUp(data: InfiniteScrollEvent = { currentScrollPosition: 0 }) {
    this.zone.run(() => this.scrolledUp.emit(data));
  }
}
