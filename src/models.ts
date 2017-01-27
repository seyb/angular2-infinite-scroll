import { ElementRef } from '@angular/core';

export type ContainerRef = Window | ElementRef | any;

export interface InfiniteScrollOptions {
  distanceDown: number;
  distanceUp: number;
  throttle: number;
  disabled: boolean;
  scrollWindow: boolean;
  immediate: boolean;
  horizontal: boolean;
  alwaysCallback: boolean;
  throttleType: string;
  on?: {
    scrollDown: Function;
    scrollUp: Function;
  }
}

export interface InfiniteScrollEvent {
  currentScrollPosition: number;
};

export interface PositionElements {
  windowElement: ContainerRef;
  horizontal: boolean;
}

export interface PositionStats {
  height: number;
  scrolledUntilNow: number;
  totalToScroll: number;
}

export interface ScrollerConfig {
  distance: {
    down: number;
    up: number;
  };
  scrollParent?: ContainerRef;
}

export interface ScrollStats {
  isScrollingDown: boolean;
  shouldScroll: boolean
}
