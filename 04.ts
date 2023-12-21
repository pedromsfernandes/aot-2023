type Address = { address: string; city: string };
type PresentDeliveryList<T extends Record<string, unknown>> = {[k in keyof T]: Address};