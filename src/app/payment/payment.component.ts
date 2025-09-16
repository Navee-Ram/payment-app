import { Component, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements AfterViewInit {
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  cartItems = [
    { id: 1, name: 'Product A', price: 30, quantity: 1 },
    { id: 2, name: 'Product B', price: 50, quantity: 1 },
    { id: 3, name: 'Product C', price: 70, quantity: 1 }
  ];

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  get total() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  cancel() {
    this.router.navigate(['/']);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPaypalScript().then(() => {
        // @ts-ignore
        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: this.total.toString(),
                  currency_code: 'USD'
                }
              }]
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              alert('Payment completed by ' + details.payer.name.given_name);
            });
          },
          onError: (err: any) => {
            alert('Payment failed: ' + err);
          },
          onCancel: (data: any) => {
            alert('Payment cancelled.');
          }
        }).render(this.paypalElement.nativeElement);
      });
    }
  }

  private loadPaypalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).paypal) {
        resolve();
        return;
      }
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        reject('Not in browser');
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=sb&currency=USD';
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
}
