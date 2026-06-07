import React from 'react';
import { useNavigate } from 'react-router';

const Error = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: '#f0f4f8', // خلفية ثابتة لطيفة
                padding: '0 20px',
            }}
        >
            <style>
                {`
          @keyframes bounce {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(-5deg); }
            100% { transform: translateY(0) rotate(5deg); }
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
            </style>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
                <img
                    src="/22.jpeg"
                    alt="Error"
                    style={{
                        width: '200px',
                        height: 'auto',
                        borderRadius: '50%',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                        animation: 'pulse 2s infinite',
                    }}
                />
            </div>

            <h1
                style={{
                    fontSize: '120px',
                    margin: 0,
                    color: '#E27019',
                    animation: 'bounce 2s ease-in-out infinite',
                }}
            >
                404
            </h1>

            <h2 style={{ fontSize: '28px', margin: '16px 0', color: '#333' }}>
                الصفحة غير موجودة
            </h2>

            <p style={{ color: '#555', marginBottom: '32px', fontSize: '16px' }}>
                يبدو أن الرابط الذي تحاول الوصول إليه غير صحيح
            </p>

            <button
                onClick={() => navigate('/')}
                style={{
                    padding: '14px 30px',
                    fontSize: '16px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#2196F3',
                    color: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.5)',
                    transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1976D2';
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(25, 118, 210, 0.6)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2196F3';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(33, 150, 243, 0.5)';
                }}
            >
                العودة للصفحة الرئيسية
            </button>
        </div>
    );
};

export default Error;