import { Subscription } from 'rxjs/Rx';
import { InfiniteScrollEvent, InfiniteScrollOptions, PositionStats, ScrollStats } from './models';
import { ScrollRegister, ScrollRegisterConfig } from './scroll-register';
import { ScrollResolver } from './scroll-resolver';

/**
 * InfiniteScroll - adds infinite scroll listener and
 * events for interacting upon scroll
 */
export class InfiniteScroller {
  static create(element: HTMLElement, options: InfiniteScrollOptions) {
    return new InfiniteScroller(element, options);
  }

  private disposeScroller: Subscription;
  private scrollerResolver: ScrollResolver;

  constructor(element: HTMLElement, options: InfiniteScrollOptions) {
    const scrollConfig: ScrollRegisterConfig = {
      throttleType: options.throttleType,
      throttleDuration: options.throttle,
      scrollWindow: options.scrollWindow,
      horizontal: options.horizontal,
      filterBefore: () => !options.disabled,
      scrollHandler: (container: PositionStats) => this.handleOnScroll(container, options)
    };
    this.scrollerResolver = ScrollResolver.create();
    this.disposeScroller = ScrollRegister.attachEvent(scrollConfig, element);
  }

  handleOnScroll(container: PositionStats, options: InfiniteScrollOptions) {
    const scrollResolverConfig = {
      distance: {
        down: options.distanceDown,
        up: options.distanceUp
      }
    };
    const scrollStats: ScrollStats = this.scrollerResolver.getScrollStats(container, scrollResolverConfig);
    if (this.shouldTriggerEvents(scrollStats.shouldScroll, options)) {
      const infiniteScrollEvent: InfiniteScrollEvent = {
        currentScrollPosition: container.scrolledUntilNow
      };
      if (scrollStats.isScrollingDown) {
        options.on.scrollDown(infiniteScrollEvent);
      } else {
        options.on.scrollUp(infiniteScrollEvent);
      }
    }
  }

  shouldTriggerEvents(shouldScroll: boolean, options: InfiniteScrollOptions) {
    return (options.alwaysCallback || shouldScroll) && !options.disabled;
  }

  destroy () {
    this.disposeScroller.unsubscribe();
  }
}