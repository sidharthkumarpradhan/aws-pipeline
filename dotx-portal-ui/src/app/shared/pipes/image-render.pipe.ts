import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'imageRender',
  pure: false
})
@Injectable()
export class ImageRender implements PipeTransform { 

    transform(image: any, defaultImag: any): any {
        if (image) {
            return environment.fileLocation + image;
        } 
        return defaultImag;
        
      }

}