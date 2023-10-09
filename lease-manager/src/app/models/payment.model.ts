export class Payment {
    id: number;                   // A unique identifier for the payment
    rentalId: number;             // The ID of the associated rental
    amount: number;               // Amount paid
    datePaid: Date;               // Date of the payment
    dueDate: Date;                // Date the payment was due
    lateFeeApplied: boolean;      // Whether a late fee was applied to this payment

    constructor(
        id: number,
        rentalId: number,
        amount: number,
        datePaid: Date,
        dueDate: Date,
        lateFeeApplied: boolean = false
    ) {
        this.id = id;
        this.rentalId = rentalId;
        this.amount = amount;
        this.datePaid = datePaid;
        this.dueDate = dueDate;
        this.lateFeeApplied = lateFeeApplied;
    }
}
