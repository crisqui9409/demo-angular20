import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TooltipInfoComponent } from './components/molecules/tooltip-info/tooltip-info.component';
import { MasterIconComponent } from './components/atoms/master-icon/master-icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TooltipInfoComponent, MasterIconComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {}
}
