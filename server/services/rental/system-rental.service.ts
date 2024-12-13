// server/services/rental/system-rental.service.ts
import { System } from '../../models/System';
import { RentalContract } from '../../models/RentalContract';
import { PaymentService } from '../payment/payment.service';
import { NotificationService } from '../notification/notification.service';
import { ApiError } from '../../utils/ApiError';

export class SystemRentalService {
    static async rentSystem(userId: string, systemId: string, rentalPeriod: number) {
        const system = await System.findById(systemId);
        if (!system) {
            throw new ApiError(404, 'System not found');
        }

        if (!system.isAvailable) {
            throw new ApiError(400, 'System is not available for rent');
        }

        const totalPrice = this.calculateRentalPrice(system.monthlyPrice, rentalPeriod);

        // Create rental contract
        const contract = await RentalContract.create({
            userId,
            systemId,
            startDate: new Date(),
            endDate: this.calculateEndDate(rentalPeriod),
            monthlyPrice: system.monthlyPrice,
            totalPrice
        });

        // Process payment
        await PaymentService.processRentalPayment(userId, totalPrice, contract.id);

        // Update system status
        await System.findByIdAndUpdate(systemId, {
            isAvailable: false,
            currentRentalId: contract.id
        });

        // Send notifications
        await NotificationService.createSystemAlert(systemId, [{
            type: 'info',
            message: 'System successfully rented'
        }]);

        return contract;
    }

    static async getRentedSystems(userId: string) {
        return RentalContract.find({
            userId,
            endDate: { $gt: new Date() }
        }).populate('systemId');
    }

    static async extendRental(contractId: string, additionalMonths: number) {
        const contract = await RentalContract.findById(contractId);
        if (!contract) {
            throw new ApiError(404, 'Rental contract not found');
        }

        const additionalPrice = this.calculateRentalPrice(
            contract.monthlyPrice,
            additionalMonths
        );

        // Process payment for extension
        await PaymentService.processRentalPayment(
            contract.userId,
            additionalPrice,
            contract.id
        );

        // Update contract
        contract.endDate = this.calculateEndDate(additionalMonths, contract.endDate);
        contract.totalPrice += additionalPrice;
        await contract.save();

        return contract;
    }

    private static calculateRentalPrice(monthlyPrice: number, months: number): number {
        const discounts = {
            3: 0,
            6: 0.1,  // 10% discount
            12: 0.2  // 20% discount
        };

        const discount = discounts[months as keyof typeof discounts] || 0;
        return monthlyPrice * months * (1 - discount);
    }

    private static calculateEndDate(months: number, startDate: Date = new Date()): Date {
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + months);
        return endDate;
    }
}
