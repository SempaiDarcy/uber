export enum VehicleFeature {
    WiFi = 'wi-fi',
    ChildSeat = 'child-seat',
    PetFriendly = 'pet-friendly',
}
export enum DriverStatus {
    Online = "online"
}
export type Driver = {
    id: number;
    name: string;
    phoneNumber: string;
    status: DriverStatus
    email: string;
    vehicleMake: string; // e.g., Toyota
    vehicleModel: string; // e.g., Camry
    vehicleYear: number;
    vehicleLicensePlate: string;
    vehicleDescription: string | null;
    vehicleFeatures: VehicleFeature[];
    createdAt: Date;
};