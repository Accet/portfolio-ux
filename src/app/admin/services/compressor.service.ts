import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {NgxPicaErrorInterface, NgxPicaService} from '@digitalascetic/ngx-pica';

interface ImageInfo {
	scaledWidth: number;
	scaledHeight: number;
	file: File;
}

@Injectable()
export class CompressorService {
	constructor(private _ngxPicaService: NgxPicaService) {}

	compress(file: File, width?: number, thumb = false): Observable<any> {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		return new Observable<ImageInfo>(observer => {
			reader.onload = ev => {
				const img = new Image();
				img.src = (ev.target as any).result;
				(img.onload = () => {
					const scaleFactor = width ? width / img.width : 1;
					const scaledWidth = img.width * scaleFactor;
					const scaledHeight = img.height * scaleFactor;
					if (thumb) {
						const regex = /(.+?)(\.[^.]*$|$)/gm;
						const fileChunks = regex.exec(file.name);

						Object.defineProperty(file, 'name', {
							writable: true,
							value: `${fileChunks[1]}_thumb${fileChunks.length === 3 ? fileChunks[2] : ''}`
						});
					}
					const info: ImageInfo = {
						file,
						scaledWidth,
						scaledHeight
					};
					observer.next(info);
				}),
					(reader.onerror = error => observer.error(error));
			};
		}).pipe(
			switchMap(result => {
				return this._ngxPicaService.resizeImage(result.file, result.scaledWidth, result.scaledHeight);
			}),
			catchError((err: NgxPicaErrorInterface) => throwError(err.err))
		);
	}
}
