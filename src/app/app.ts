import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyIpService } from './services/my-ip.service';
import { InputTextComponent } from './components/atoms/input-text/input-text.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InputTextComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('demo-angular20-shell');
  private myIpService = inject(MyIpService);

  ngOnInit(): void {
    this.myIpService.getMyIp().subscribe((resp) => {
      console.log('ip shell: ', resp);
    });
  }
}
