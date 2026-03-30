export interface Feature {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

export interface Stat {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: string;
    color?: string;
}

export interface Alert {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color?: string;
    bgColor?: string;
}


export interface Project {
    id: string;
    name: string;
    client: string;
    status: 'Planning' | 'Ongoing' | 'Completed' | 'On Hold';
    progress: number;
    startDate: string;
    endDate?: string;
}

export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    stock: number;
    unit: string;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Lead {
    id: string;
    clientName: string;
    location: string;
    contactNumber: string;
    status: 'New' | 'Follow-up' | 'Converted' | 'Lost';
    date: string;
}

export interface Quotation {
    id: string;
    clientName: string;
    location: string;
    contactNumber: string;
    totalAmount: number;
    status: 'Draft' | 'Sent' | 'Approved' | 'Rejected';
    date: string;
    items: QuotationItem[];
}

export interface QuotationItem {
    id: string;
    description: string;
    width: number;
    height: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface JobOrder {
    id: string;
    quotationId: string;
    clientName: string;
    status: 'Pending' | 'In Production' | 'Installation' | 'Completed';
    date: string;
    serialNumber: string;
}
