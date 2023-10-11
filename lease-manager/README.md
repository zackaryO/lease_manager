# LeaseManager

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## todo (not complete)

combine rental and rental-detail service to reduce API calls

### Tables to build:

## 1. payment log

leaseHolderName: string;
leaseHolderId: number; // The ID of the associated with the lease holder (db foreign key)
amount: number; // Amount paid (rent + latefee)
datePaid: Date; // Date of the payment
dueDate: Date; // Date the payment was due
lateFeeApplied: boolean; //may need to set latefee amount

## 2. RentailDetail

lotNumber: number;
leaseHolderName: string;
address: string;
email: string;
phone: string;
monthlyRentalAmount: number;
dueDate: Date;
gracePeriod: number; // This can be in days or however you measure the grace period
leaseAgreementPath: string; // Assuming this will be a path or URL to the lease agreement file
imageUrl: string;
paymentStatus: 'up-to-date' | 'less-than-7' | 'over-7';
lastPaymentDate?: Date;
lastPaymentId?: number; // Add this line if your backend indeed returns such an ID

## 3.GlobalSetting(Default)

dueDate: Date;
lateFee: number
daysLate: number
dayDeliquent: number

### END Tables to build:

## the ComponentCanDeactivate on navbar isnt working

this is supposed to ask the user if they want to save their changes before the navigate away from the page, if the made changes
