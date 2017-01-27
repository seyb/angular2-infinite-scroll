import { PositionResolver, PositionResolverFactory } from './position-resolver';
import { ContainerRef } from './models';
import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/operator/filter';


export interface ScrollRegisterConfig {
  throttleType: string;
  throttleDuration: number;
  filterBefore: Function;
  scrollHandler: Function;
  scrollWindow: boolean;
  horizontal: boolean;
}

export class ScrollRegister {
  static attachEvent (options: ScrollRegisterConfig, element: HTMLElement): Subscription {
    const containerElement = options.scrollWindow ? window : element;
    const positionResolver = PositionResolverFactory.create({
      windowElement: containerElement,
      horizontal: options.horizontal
    });
    const scroller$: Subscription = Observable.fromEvent(positionResolver.container, 'scroll')
      [options.throttleType](() => Observable.timer(options.throttleDuration))
      .filter(options.filterBefore)
      .mergeMap((ev: any) => Observable.of(positionResolver.calculatePoints(element)))
      .subscribe(options.scrollHandler);
    return scroller$;
  }
}
