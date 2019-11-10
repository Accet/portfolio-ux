import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class CompressorService {
	private renderer: Renderer2;

	constructor(rendererFactory: RendererFactory2) {
		this.renderer = rendererFactory.createRenderer(null, null);
	}
	compress(file: File, width?: number, thumb = false): Observable<any> {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		return new Observable(observer => {
			reader.onload = ev => {
				const img = new Image();
				img.src = (ev.target as any).result;
				(img.onload = () => {
					const elem = this.renderer.createElement('canvas');
					const scaleFactor = width ? width / img.width : 1;
					elem.width = img.width * scaleFactor;
					elem.height = img.height * scaleFactor;
					const regex = /(.+?)(\.[^.]*$|$)/gm;
					const fileChunks = regex.exec(file.name);
					const fileName = thumb ? `${fileChunks[1]}_thumb${fileChunks.length === 3 ? fileChunks[2] : ''}` : file.name;
					const ctx = elem.getContext('2d') as CanvasRenderingContext2D;
					ctx.drawImage(img, 0, 0, elem.width, elem.height);
					ctx.canvas.toBlob(
						blob => {
							observer.next(
								new File([blob], fileName, {
									type: file.type,
									lastModified: Date.now()
								})
							);
						},
						file.type,
						1
					);
				}),
					(reader.onerror = error => observer.error(error));
			};
		}).pipe(
			tap(() => {
				console.log('Function: HERE, : ');
			})
		);
	}
}
