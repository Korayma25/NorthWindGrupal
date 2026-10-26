import { Component, input } from '@angular/core';

@Component({
  selector: 'app-message-alert',
  standalone: true,
  template: `
    <div [class]="'alert alert-' + type() + ' my-2'" role="alert">
      <ng-content></ng-content>
    </div>
  `
})
export class MessageAlertComponent {
  public readonly type = input<string>('info');
}
