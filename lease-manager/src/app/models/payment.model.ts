export interface Payment {
    leaseId: number; // Assuming you'll pass the lease ID from frontend
    payment_date: string; // should be in YYYY-MM-DD format
    payment_amount: number;
    payment_method: string;
    transaction_id?: string;
    notes?: string;
    receipt?: File; // Assuming you'll pass the file directly
    // omitting other fields since they might be managed by the backend directly
}