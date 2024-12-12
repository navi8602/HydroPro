import { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { HydroponicSystem, RentalPeriod } from '../../types/system';
import { RENTAL_PERIODS } from '../../data/systems';
import { SystemCard } from './SystemCard';
import { calculateRentalPrice } from '../../utils/rental';
import { 
  Calendar, CreditCard, Package, 
  CheckCircle, AlertTriangle 
} from 'lucide-react';

interface SystemRentalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRent: (systemId: string, months: number) => void;
  selectedSystem: HydroponicSystem;
}

export function SystemRentalDialog({
  isOpen,
  onClose,
  onRent,
  selectedSystem
}: SystemRentalDialogProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<RentalPeriod>(RENTAL_PERIODS[0]);
  const [isConfirming, setIsConfirming] = useState(false);

  const { price, discount } = calculateRentalPrice(
    selectedPeriod.months,
    selectedSystem.monthlyPrice
  );

  const handleConfirm = () => {
    onRent(selectedSystem.id, selectedPeriod.months);
    onClose();
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title={isConfirming ? "Подтверждение аренды" : "Аренда системы"}
    >
      <div className="space-y-6">
        {!isConfirming ? (
          <>
            <SystemCard system={selectedSystem} />

            <div>
              <h4 className="font-medium mb-3">Выберите период аренды:</h4>
              <div className="grid gap-3">
                {RENTAL_PERIODS.map((period) => {
                  const { price: periodPrice, discount: periodDiscount } = 
                    calculateRentalPrice(period.months, selectedSystem.monthlyPrice);
                  
                  return (
                    <button
                      key={period.months}
                      onClick={() => setSelectedPeriod(period)}
                      className={`
                        p-4 rounded-lg border-2 text-left
                        ${selectedPeriod.months === period.months
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {period.months} месяца
                            {period.discount > 0 && 
                              <span className="ml-2 text-green-600 text-sm">
                                -{period.discount * 100}%
                              </span>
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            {Math.round(periodPrice / period.months)} ₽/месяц
                          </p>
                        </div>
                        <p className="text-lg font-semibold">
                          {periodPrice} ₽
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md 
                         hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={() => setIsConfirming(true)}
                className="px-4 py-2 text-sm font-medium text-white 
                         bg-indigo-600 border border-transparent 
                         rounded-md hover:bg-indigo-700"
              >
                Продолжить
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Детали заказа:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Система:</span>
                    <span className="font-medium">{selectedSystem.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Период аренды:</span>
                    <span className="font-medium">{selectedPeriod.months} месяца</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Стоимость в месяц:</span>
                    <span className="font-medium">
                      {Math.round(price / selectedPeriod.months)} ₽
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Скидка:</span>
                      <span>-{discount} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Итого:</span>
                    <span>{price} ₽</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Доставка в течение 2-3 рабочих дней</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span>Бесплатная установка и настройка</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span>Оплата при получении</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium">Важная информация</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Требуется подключение к водопроводу и электричеству</li>
                    <li>Необходимо свободное пространство согласно размерам системы</li>
                    <li>Рекомендуется стабильное интернет-соединение</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsConfirming(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md 
                         hover:bg-gray-50"
              >
                Назад
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white 
                         bg-indigo-600 border border-transparent 
                         rounded-md hover:bg-indigo-700"
              >
                Подтвердить аренду
              </button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}