import { Lot } from './lot.model'; // Adjust the path as per your project structure
import { LeaseHolder } from './lease-holder.model'; // Adjust the path as per your project structure

export class Lease {
    constructor(
        public id: number,
        public lot_number: string,
        public lot_address: string,
        public lease_holder_first_name: string,
        public lease_holder_last_name: string,
        public email: string,
        public phone: string,
        public monthly_rental_amount: number,
        public due_date: number,
        public grace_period: number,
        public lease_agreement_path: string,
        public lot_image_path: string,
        public payment_status: string
        // ... include other properties as needed
    ) { }
}
