import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class CompressorService {
	private renderer: Renderer2;

	constructor(rendererFactory: RendererFactory2) {
		this.renderer = rendererFactory.createRenderer(null, null);
	}
	compress(file: File): Observable<any> {
		const width = 600;
		const reader = new FileReader();
		reader.readAsDataURL(file);
		return new Observable(observer => {
			reader.onload = ev => {
				const img = new Image();
				img.src = (ev.target as any).result;
				(img.onload = () => {
					const elem = this.renderer.createElement('canvas');
					const scaleFactor = width / img.width;
					elem.width = width;
					elem.height = img.height * scaleFactor;
					const ctx = elem.getContext('2d') as CanvasRenderingContext2D;
					ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
					ctx.canvas.toBlob(
						blob => {
							observer.next(
								new File([blob], file.name, {
									type: 'image/jpeg',
									lastModified: Date.now()
								})
							);
						},
						'image/jpeg',
						1
					);
				}),
					(reader.onerror = error => observer.error(error));
			};
		});
	}
}
