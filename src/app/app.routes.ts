import { Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { PaymentComponent } from './payment/payment.component';

export const routes: Routes = [
	{ path: '', component: CartComponent },
	{ path: 'payment', component: PaymentComponent }
];
