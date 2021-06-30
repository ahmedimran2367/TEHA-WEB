export interface SmokeDetectorCount {
    error: number;
    ok: number;
}

export interface OrdersCount {
    plumbing: number;
    reading: number;
    interimReading: number;
    energyCertificate: number;
    drinkingWaterSampling: number;
    smokeDetectorTest: number;
}

export interface ReadingCount {
    finalized: number;
    preparation: number;
}

export interface DashboardInfo {
    news: any[];
    smokeDetectorCount: SmokeDetectorCount;
    ordersCount: OrdersCount;
    finalizedAccountingCount: number;
    dataMissingAccountingCount: number;
    inProgressAccountingCount: number;
    pendingInvoiceCount: number;
    readingCount: ReadingCount;
    offerRequestCount: number;
}
