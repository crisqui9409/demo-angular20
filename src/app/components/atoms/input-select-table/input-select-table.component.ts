import { Component, input, output, signal, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'bocc-input-select-table',
  imports: [],
  templateUrl: './input-select-table.component.html',
  styleUrl: './input-select-table.component.scss',
})
export class InputSelectTableComponent {
  /** Lista de opciones de cantidad de registros a mostrar */
  public options = input<number[]>([10, 20, 50]);

  /** Valor inicial seleccionado */
  public selectedSize = input<number>(10);

  /** Evento que emite el nuevo valor seleccionado */
  public sizeChange = output<number>();

  /** Estado del desplegable (abierto/cerrado) */
  public isOpen = signal(false);

  /** Valor actualmente visualizado en el selector */
  public currentValue = signal<number>(10);

  constructor(private elementRef: ElementRef) {
    // Sincronizar el valor inicial del input con el estado interno
    // Usamos un effect o simplemente inicializamos en el constructor si es posible
    // Pero como es un input signal, lo ideal es manejarlo con el valor del signal directamente
  }

  // Inicializamos el valor actual basándonos en el input inicial
  ngOnInit() {
    this.currentValue.set(this.selectedSize());
  }

  /** Alterna la visibilidad del desplegable */
  public toggleDropdown(): void {
    this.isOpen.update((value) => !value);
  }

  /** Selecciona una opción y cierra el menú */
  public selectOption(option: number): void {
    this.currentValue.set(option);
    this.sizeChange.emit(option);
    this.isOpen.set(false);
  }

  /** Cierra el desplegable si se hace clic fuera del componente */
  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
