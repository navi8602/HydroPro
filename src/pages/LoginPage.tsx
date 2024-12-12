
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';

export function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    try {
      setLoading(true);
      setError('');
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      if (cleanPhone.length !== 11) {
        setError('Введите корректный номер телефона');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStep('code');
      } else {
        setError(data.error || 'Ошибка при отправке кода');
      }
    } catch (error) {
      console.error('Error sending code:', error);
      setError('Сервер недоступен');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (code.length !== 4) {
        setError('Код должен состоять из 4 цифр');
        return;
      }

      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          phone: phoneNumber.replace(/\D/g, ''),
          code 
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Неверный код');
      }
    } catch (error) {
      setError('Ошибка сервера');
    } finally {
      setLoading(false);
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
                let value = e.target.value.replace(/\D/g, '');
                if (value.startsWith('7') || value.startsWith('8')) {
                  value = value.substring(1);
                }
                if (value.length <= 10) {
                  let formatted = '+7';
                  if (value.length > 0) {
                    formatted += ' (' + value.slice(0, Math.min(3, value.length));
                  }
                  if (value.length > 3) {
                    formatted += ') ' + value.slice(3, Math.min(6, value.length));
                  }
                  if (value.length > 6) {
                    formatted += '-' + value.slice(6, Math.min(8, value.length));
                  }
                  if (value.length > 8) {
                    formatted += '-' + value.slice(8, Math.min(10, value.length));
                  }
                  setPhoneNumber(formatted);
                }
              }}
              placeholder="+7 (999) 999-99-99"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleSendCode}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Отправка...' : 'Получить код'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              maxLength={4}
              placeholder="Введите код из СМС"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleVerifyCode}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Проверка...' : 'Войти'}
            </button>
            <button
              onClick={() => {
                setStep('phone');
                setCode('');
                setError('');
              }}
              className="w-full text-blue-500 hover:text-blue-600"
            >
              Другой номер
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
