import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyIpService } from './services/my-ip.service';
import { InputTextComponent } from './components/atoms/input-text/input-text.component';
import { InputSelectComponent } from './components/atoms/input-select/input-select.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InputTextComponent, InputSelectComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('BOC Design System Playground');
  private myIpService = inject(MyIpService);

  // Playground State
  readonly cities = signal(['Medellín', 'Bogotá', 'Cali', 'Barranquilla', 'Cartagena']);
  readonly simulateError = signal(false);
  readonly simulateDisabled = signal(false);

  ngOnInit(): void {
    this.myIpService.getMyIp().subscribe((resp) => {
      console.log('ip shell: ', resp);
    });
  }

  toggleError() {
    this.simulateError.update(v => !v);
  }

  toggleDisabled() {
    this.simulateDisabled.update(v => !v);
  }

  onOptionSelected(event: any) {
    console.log('Option selected in playground:', event);
  }
}
