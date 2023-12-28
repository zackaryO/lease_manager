import { Lot } from './lot.model'; // Adjust the path as per your project structure
import { LeaseHolder } from './lease-holder.model'; // Adjust the path as per your project structure

export class Lease {
    constructor(
        public id: number,
        public lot: Lot,
        public lease_holder: LeaseHolder,
        public monthly_rental_amount: number,
        public due_date: number,
        public grace_period: number,
        public lease_agreement_path: string,
        public lot_image_path: string,
        public payment_status: string
    ) { }
}
