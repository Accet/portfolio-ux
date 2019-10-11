import {ElementRef} from '@angular/core';
import * as Inputmask from 'inputmask';

export function addInputmaskForPhone(el: ElementRef) {
	Inputmask({mask: '+9{11,15}', greedy: false}).mask(el);
}
