export class RentalDetail {
    lotNumber: number;
    leaseHolderName: string;
    address: string;
    email: string;
    phone: string;
    monthlyRentalAmount: number;
    dueDate: Date;
    gracePeriod: number;  // This can be in days or however you measure the grace period
    leaseAgreementPath: string;  // Assuming this will be a path or URL to the lease agreement file
    imageUrl: string;
    paymentStatus: 'up-to-date' | 'less-than-7' | 'over-7';

    constructor(
        lotNumber: number = 0,
        leaseHolderName: string = '',
        address: string = '',
        email: string = '',
        phone: string = '',
        monthlyRentalAmount: number = 0,
        dueDate: Date = new Date(),
        gracePeriod: number = 0,
        leaseAgreementPath: string = '',
        imageUrl: string = '',
        paymentStatus: 'up-to-date' | 'less-than-7' | 'over-7' = 'up-to-date'
    ) {
        this.lotNumber = lotNumber;
        this.leaseHolderName = leaseHolderName;
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.monthlyRentalAmount = monthlyRentalAmount;
        this.dueDate = dueDate;
        this.gracePeriod = gracePeriod;
        this.leaseAgreementPath = leaseAgreementPath;
        this.imageUrl = imageUrl;
        this.paymentStatus = paymentStatus;
    }
}
