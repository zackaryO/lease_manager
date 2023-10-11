export class GlobalDefault {
    dueDay: number; // This now represents the day of the month on which payment is due
    lateFee!: number;
    daysLate!: number;
    dayDelinquent!: number;

    constructor(data?: any) {
        if (data) {
            this.dueDay = data.dueDay || 1; // Default to the 1st of the month if no specific day is provided
            this.lateFee = data.lateFee;
            this.daysLate = data.daysLate;
            this.dayDelinquent = data.dayDelinquent;
        } else {
            // Default values are set here if `data` is undefined
            this.dueDay = 1; // Default to the 1st of the month
            // ... you can set other default values here as needed
        }
    }

    // No longer need a method to calculate the next due date, as we're only dealing with the day of the month

    // Serialize the object data for sending to the backend
    serialize() {
        return {
            dueDay: this.dueDay, // We're only dealing with a day, not a full date
            lateFee: this.lateFee,
            daysLate: this.daysLate,
            dayDelinquent: this.dayDelinquent,
        };
    }

    // Static method to deserialize data received from the backend
    static deserialize(data: any): GlobalDefault {
        return new GlobalDefault(data);
    }
}
