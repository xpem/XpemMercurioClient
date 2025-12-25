    // public record OrdersFilterReq
    // {
    //     public string? OrderExternalId { get; set; }

    //     public string? BuyerName { get; set; }

    //     public DateTime? CreatedAfter { get; set; }

    //     public DateTime? CreatedBefore { get; set; }

    //     public string? ProductExternalId { get; set; } 

    //     public string? ProductSKU { get; set; } 

    //     public string? ProductName { get; set; }

    //     public Marketplace? Marketplace { get; set; }

    // }

export interface OrderFilter {
    orderExternalId?: string;
    buyerName?: string;
    createdAfter?: Date;
    createdBefore?: Date;
    productExternalId?: string;
    productName?: string;
}