import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translation'
})
export class TranslationPipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    // Utiliza el servicio de traducción para obtener la traducción
    return this.translationService.translate(key);
  }
}
