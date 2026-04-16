import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Services
import { MyIpService } from './services/my-ip.service';

// Components
import { InputTextComponent } from './components/atoms/input-text/input-text.component';
import { InputSelectComponent } from './components/atoms/input-select/input-select.component';
import { AvatarComponent } from './components/atoms/avatar/avatar.component';

// Directives
import { TooltipDirective } from './directives/tooltip.directive';

// Types
import { TooltipOrientation } from './types/component_type';

// Pipes
import { TextPipe } from './pipes/text-pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    InputTextComponent, 
    InputSelectComponent, 
    TooltipDirective, 
    AvatarComponent,
    TextPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  /** Reference to TooltipOrientation enum for template usage */
  readonly TooltipOrientation = TooltipOrientation;

  protected readonly title = signal('BOC Design System Playground');
  private myIpService = inject(MyIpService);

  // Playground State
  readonly cities = signal(['Medellín', 'Bogotá', 'Cali', 'Barranquilla', 'Cartagena']);
  readonly simulateError = signal(false);
  readonly simulateDisabled = signal(false);
  readonly pswrdValue = signal('');

  // User Authentication Simulation
  readonly currentUser = signal<any>(null);

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

  // Avatar Menu Simulation
  readonly isMenuExpanded = signal(true);

  toggleMenu() {
    this.isMenuExpanded.update(v => !v);
  }

  onOptionSelected(event: any) {
    console.log('Option selected in playground:', event);
  }

  simulateLogin() {
    this.currentUser.set({
      name: 'Cristian Quintana',
      role: 'Analista Senior de Desarrollo',
      photo: 'https://i.pravatar.cc/150?u=antigravity_dev'
    });
  }

  simulateLogout() {
    this.currentUser.set(null);
  }
}
