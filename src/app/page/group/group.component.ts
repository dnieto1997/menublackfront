import { Component, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../user/user.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

interface Group {
  id: number;
  img: string;
  code: string;
  order: number;
  name: string;
  days: string[];
  hours: string[]; // Asumiendo que esto debería ser un array de strings
  observations: string;
  status: boolean;
}

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent {
  public loading: boolean = true;
  public showTable: boolean = false;
  public display: boolean = false;
  public display2: boolean = false;
  public squeleto: boolean = true;
  public list: any[] = [];
  public data: any = {};
  public data2: Group = {
    id: 1,
    img: '',
    code: '',
    order: 0,
    name: '',
    days: [], // Parsea el string JSON para convertirlo en un arreglo de strings
    hours: [], // Lo mismo para hours
    observations: '',
    status: true,
  };

  public day: string[] = [];
  days = [
    { label: 'Lunes', value: '01', selected: false },
    { label: 'Martes', value: '02', selected: false },
    { label: 'Miercoles', value: '03', selected: false },
    { label: 'Jueves', value: '04', selected: false },
    { label: 'Viernes', value: '05', selected: false },
    { label: 'Sabado', value: '06', selected: false },
    { label: 'Domingo', value: '07', selected: false },
  ];
  public selectedItem: any;
  public newHour: string = '';
  public hours: string[] = [];
  public hours2: string[] = [];
  public hours3: string[] = [];
  public hours4: string[] = [];
  public diasSemana: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  public editItemId: number | null = null;

  constructor(private auth: AuthService, private cdr: ChangeDetectorRef) {
    this.hours2 = this.generateHours();
    this.hours4 = this.generateHours();
  }

  ngOnInit(): void {
    this.findAll();
  }
  findAll() {
    this.auth.findAllGroup({}).subscribe(
      (res: any) => {
        console.log(res);
        this.list = res;
        this.loading = false;
        this.showTable = true;
        this.squeleto = false;
      },
      (error: any) => {
        this.loading = false;
        if (error.status == 401) {
          Swal.fire({
            title: 'Token Expirado',
            text: 'Your session has expired. Please log in again.',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              // Acción cuando se hace clic en el botón Aceptar
              this.auth.close();
            }
          });
        }
      }
    );
  }
  openModal() {
    /*     this.data = {
      img: '',
      code: '',
      order: '',
      name: '',
      days: [],
      hours: [],
      observations: '',
    }; */
    // Reiniciar los días seleccionados
    this.day = [];
    this.days.forEach((day) => (day.selected = false));
    // Reiniciar las horas seleccionadas
    this.hours = [];
    // Abrir el modal de creación de grupo
    this.display = true;
  }

  validateNumberInput(event: any) {
    const input = event.target;
    const value = input.value;
    input.value = value.replace(/[^0-9]/g, ''); // Solo permite números
  }

  toggleDay(day: any) {
    day.selected = !day.selected;
    if (day.selected) {
      this.day.push(day.value);
    } else {
      this.day = this.day.filter((selectedDay) => selectedDay !== day.value);
    }
  }
  toggleDay2(day: any) {
    const selectedDay = day.value;

    // Verificar si el cliente ha realizado alguna modificación
    if (typeof this.data2.days === 'string') {
      // Si es un string, conviértelo en un arreglo
      this.data2.days = JSON.parse(this.data2.days);
    }

    // Obtener el día sin formato
    const dayWithoutQuotes = selectedDay.replace(/"/g, '');

    // Verificar si el día está presente originalmente en el arreglo data2.days
    const index = this.data2.days.indexOf(dayWithoutQuotes);

    // Si el día está presente, eliminarlo; de lo contrario, agregarlo
    if (index !== -1) {
      this.data2.days.splice(index, 1);
    } else {
      this.data2.days.push(dayWithoutQuotes);
    }

    // Verificar si el arreglo de días está vacío
    if (this.data2.days.length === 0) {
      // Mostrar un mensaje de alerta utilizando Swal
      Swal.fire({
        title: 'Warning',
        text: 'You must select at least one day.',
        icon: 'warning',
      });
    }
  }

  generateHours(): string[] {
    const hours: string[] = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      hours.push(hour);
    }
    return hours;
  }

  addHour(hour: string) {
    if (hour && !this.hours.includes(hour)) {
      this.hours.push(hour);
    }
  }

  removeHour(hour: string) {
    const index = this.hours.indexOf(hour);
    if (index !== -1) {
      this.hours.splice(index, 1);
    }
  }

  get filteredHours(): string[] {
    return this.hours2.filter((hour) => !this.hours.includes(hour));
  }

  get filteredHours2(): string[] {
    return this.hours4.filter((hour) => !this.data2.hours.includes(hour));
  }

  async createGroup() {
    this.data.days = this.day;
    this.data.hours = this.hours;
    if (
      !this.data.img ||
      !this.data.code ||
      !this.data.order ||
      !this.data.name ||
      !this.data.observations ||
      !this.data.hours
    ) {
      // Si alguna de las variables está vacía, muestra una alerta con SweetAlert2
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos.',
        icon: 'error',
      });
      return; // Evitar que se envíe el formulario
    }

    try {
      const res = await this.auth.createGroup(this.data).toPromise();

      if (res.status === 201) {
        Swal.fire({
          title: 'Success',
          text: res.message,
          icon: 'success',
        }).then(() => {
          this.findAll(); // Asegúrate de actualizar la página después de la confirmación
        });

        // Llamar a findAll después de crear el grupo con éxito para actualizar la lista de grupos

        this.data = {
          img: '',
          code: '',
          order: '',
          name: '',
          days: [],
          hours: [],
          observations: '',
        };
        this.display = false; // Cerrar el modal

        // Forzar la actualización de la interfaz de usuario después de que se actualice la lista de grupos
        this.cdr.detectChanges();
      }
    } catch (error: any) {
      if (error.status == 401) {
        this.auth.close();
      }
    }
  }

  removePTags(text: string): string {
    return text.replace(/<\/?p>/g, '');
  }

  convertirDia(dias: string | string[]): string {
    // Log the raw input

    const nombresDias: { [key: string]: string } = {
      '01': 'Lunes',
      '02': 'Martes',
      '03': 'Miércoles',
      '04': 'Jueves',
      '05': 'Viernes',
      '06': 'Sábado',
      '07': 'Domingo',
    };

    if (!dias) {
      return ''; // Return an empty string if no days are defined
    }

    // Convert the input to an array if it is not already one
    const diasArray =
      typeof dias === 'string'
        ? dias
            .replace(/[\[\]"]+/g, '') // Remove square brackets and quotes
            .split(',')
            .map((d) => d.trim()) // Trim and split the string
        : dias.flat(); // Flatten the array if it's nested

    const nombres = diasArray.map((codigo) => {
      const trimmedCodigo = codigo.trim(); // Trim to remove leading/trailing spaces
      const dayName = nombresDias[trimmedCodigo]; // Get the day name corresponding to the code

      return dayName || 'Sin dias Seleccionados';
    });

    return nombres.join(', ');
  }

  toggleUserStatus(id: any, status: any) {
    this.auth.updateGroupStatus(id, { status }).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Status Changed',
          text:
            'User status Was Changed: ' +
            (status == true ? 'Desactivate' : 'Activate'),
        });
        this.findAll();
      },
      (error: any) => {
        if (error.status == 401) {
          this.auth.close();
        }
      }
    );
  }

  verificarURLImagen(url: string): string {
    if (url.startsWith('https://')) {
      return url; // Si la URL comienza con "https://", es válida
    } else {
      return '../../../assets/noimage.jpg'; // Si la URL no es válida, devuelve la ruta de la imagen "No imagen"
    }
  }

  eliminar(cadena: string): string {
    return cadena.replace(/[\[\]"]/g, '');
  }

  openEditDialog(item: any) {
    this.display2 = true;
    this.display = false;
    this.auth.findgroup(item).subscribe((res: any) => {
      this.data2 = res;
      this.data2.hours = JSON.parse(res.hours);
    });

    // Lógica para cargar los datos del grupo seleccionado en el diálogo de edición
  }

  addHour2(hour: string) {
    // Si data2.hours no es un array o no está definido, inicialízalo como un array vacío
    if (!Array.isArray(this.data2.hours)) {
      this.data2.hours = [];
    }

    // Verifica si la hora no está en data2.hours y luego la agrega
    if (hour && !this.data2.hours.includes(hour)) {
      this.data2.hours.push(hour);
    }
  }

  removeHour2(hour: string) {
    // Busca el índice de la hora en data2.hours
    const index = this.data2.hours.indexOf(hour);

    // Si la hora existe en data2.hours, la elimina
    if (index !== -1) {
      this.data2.hours.splice(index, 1);
    }
  }

  EditGroup(id: any) {
    if (typeof this.data2.days === 'string') {
      try {
        // Intentar convertir el string en un array
        this.data2.days = JSON.parse(this.data2.days);
      } catch (error) {
        console.error('Error al convertir el string en array:', error);
      }
    }
    this.auth
      .updateGroup(id, {
        img: this.data2.img,
        code: this.data2.code,
        order: this.data2.order,
        name: this.data2.name,
        days: this.data2.days,
        hours: this.data2.hours,
        observations: this.data2.observations,
      })
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.status == 201) {
            Swal.fire({
              title: 'Success',
              text: res.message,
              icon: 'success',
            }).then(() => {
              this.findAll(); // Asegúrate de actualizar la página después de la confirmación
            });
          }
          this.display2 = false;
        },
        (error: any) => {
          if (error.status == 401) {
            this.auth.close();
          }
        }
      );
  }
}
