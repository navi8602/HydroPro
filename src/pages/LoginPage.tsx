
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';

export function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const navigate = useNavigate();

  const handleSendCode = () => {
    // Здесь будет логика отправки кода
    setStep('code');
  };

  const handleVerifyCode = () => {
    // Здесь будет логика проверки кода
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Вход в систему
        </h1>
        {step === 'phone' ? (
          <div className="space-y-4">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+7 (999) 999-99-99"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleSendCode}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Получить код
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Введите код из СМС"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleVerifyCode}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Войти
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
