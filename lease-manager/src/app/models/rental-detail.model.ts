// rental-detail.model.ts
export class RentalDetail {
    [key: string]: any; // Keeps the index signature
    id: number; // matches "id" from the API
    lotNumber: number; // matches "lot_number" from the API
    lotAddress: string; // matches "lot_address" from the API
    leaseHolderName: string; // matches "lease_holder_name" from the API
    email: string; // matches "email" from the API
    phone: string; // matches "phone" from the API
    monthlyRentalAmount: number; // This should be a number, but the API returns a string, you might need to parse it
    dueDate: number; // matches "due_date" from the API, and is a number possibly representing days
    gracePeriod: number; // matches "grace_period" from the API
    leaseAgreementPath: string; // new field to match "lease_agreement_path" from the API
    lotImagePath: string; // new field to match "lot_image_path" from the API
    paymentStatus: 'up-to-date' | 'less-than-7' | 'over-7'; // matches "payment_status" from the API

    constructor(
        id: number = 0,
        lotNumber: number = 0,
        lotAddress: string = '',
        leaseHolderName: string = '',
        email: string = '',
        phone: string = '',
        monthlyRentalAmount: number = 0, // consider parsing to number if necessary
        dueDate: number = 0,
        gracePeriod: number = 0,
        leaseAgreementPath: string = '', // new field
        lotImagePath: string = '', // new field
        paymentStatus: 'up-to-date' | 'less-than-7' | 'over-7' = 'up-to-date'
    ) {
        this.id = id;
        this.lotNumber = lotNumber;
        this.lotAddress = lotAddress;
        this.leaseHolderName = leaseHolderName;
        this.email = email;
        this.phone = phone;
        this.monthlyRentalAmount = monthlyRentalAmount;
        this.dueDate = dueDate;
        this.gracePeriod = gracePeriod;
        this.leaseAgreementPath = leaseAgreementPath; // new field
        this.lotImagePath = lotImagePath; // new field
        this.paymentStatus = paymentStatus;
    }
}
