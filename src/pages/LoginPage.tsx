
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone'); // phone or code
  const navigate = useNavigate();

  const handleSendCode = async () => {
    try {
      const response = await fetch('http://0.0.0.0:3002/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phone.replace(/\D/g, '') }),
      });
      
      if (response.ok) {
        setStep('code');
      }
    } catch (error) {
      console.error('Error sending code:', error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch('http://0.0.0.0:3002/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ''),
          code
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Вход в систему
        </h2>
        
        {step === 'phone' ? (
          <div className="mt-8 space-y-6">
            <InputMask
              mask="+7 (999) 999-99-99"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="+7 (___) ___-__-__"
            />
            <button
              onClick={handleSendCode}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Получить код
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Введите код из СМС"
              maxLength={4}
            />
            <button
              onClick={handleVerifyCode}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Войти
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
