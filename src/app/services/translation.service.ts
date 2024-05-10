import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLanguage = 'es';

  private translations: { [key: string]: any } = {
    dashboard: {
      card: {
        card1: {
          title: {
            en: 'Total orders',
            es: 'Total de pedidos',
          },
          subtitle1: {
            en: 'Success',
            es: 'Exitosa',
          },
          subtitle2: {
            en: 'Pending',
            es: 'Pendiente',
          },
        },
        card2: {
          title: {
            en: 'Total domiciles',
            es: 'Total domicilios',
          },
          subtitle1: {
            en: 'Success',
            es: 'Exitosa',
          },
          subtitle2: {
            en: 'Pending',
            es: 'Pendiente',
          },
        },
        card3: {
          title: {
            en: 'Withdrawal USDT Trm',
            es: 'Retiro USDT Trm',
          },
          subtitle1: {
            en: 'Success',
            es: 'Exitosa',
          },
          subtitle2: {
            en: 'Pending',
            es: 'Pendiente',
          },
        },
      },
    },
  };

  constructor() {}

  setLanguage(language: string) {
    this.currentLanguage = language;
  }

  getLanguage() {
    return this.currentLanguage;
  }

  translate(key: string): string {
    // Implementa la lógica para obtener las traducciones en el idioma actual
    const keys = key.split('.'); // Divide la clave en partes

    // Recorre las partes de la clave para acceder a la traducción anidada
    let translation = this.translations;
    for (const k of keys) {
      translation = translation[k];
      if (!translation) {
        break;
      }
    }

    if (translation) {
      return translation[this.currentLanguage] || key;
    }
    return key;
  }
}
