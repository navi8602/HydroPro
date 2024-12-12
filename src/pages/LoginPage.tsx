
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { IMaskInput } from 'react-imask';

export function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async () => {
    // Проверка формата номера телефона
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Введите номер в формате +7 (999) 999-99-99');
      return;
    }

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ phone: cleanPhone })
      });
      
      if (response.ok) {
        setStep('code');
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Ошибка при отправке кода');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Ошибка сервера. Пожалуйста, попробуйте позже');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, code })
      });
      
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError('Ошибка сервера. Попробуйте позже');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Вход в систему
        </h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {step === 'phone' ? (
          <div className="space-y-4">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                  let formatted = '+7';
                  if (value.length > 0) {
                    formatted += ' (' + value.substring(0, 3);
                    if (value.length > 3) {
                      formatted += ') ' + value.substring(3, 6);
                      if (value.length > 6) {
                        formatted += '-' + value.substring(6, 8);
                        if (value.length > 8) {
                          formatted += '-' + value.substring(8, 10);
                        }
                      }
                    }
                  }
                  setPhoneNumber(formatted);
                }
              }}
              placeholder="+7 (999) 999-99-99"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleSendCode}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Войти
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
