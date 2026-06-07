import React, { useState, useRef, useEffect } from 'react';
import NavUser from '../Component/NavUser';
import { FiSend } from 'react-icons/fi';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'مرحباً! أنا Fixora مساعدك الذكي 😊 كيف يمكنني مساعدتك اليوم؟', time: '10:30 ص' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { from: 'user', text: input, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) }]);
        setInput('');

        // محاكاة رد البوت
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { from: 'bot', text: 'تم استلام رسالتك! سيقوم أحد الفنيين بالرد خلال ساعة واحدة 🔹', time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) }
            ]);
        }, 800);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const quickReplies = ['أريد الاستفسار عن حالة حجزي', 'فحص مشكلتي', 'عرض حجوزاتي'];

    return (
        <>
            <NavUser showMenu={false} />
            <div className="d-flex flex-column mx-auto shadow my-4" style={{ width: "100%", maxWidth: "950px", backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden' }}>
                <div className="d-flex flex-column" style={{ backgroundColor: "#EBF3FE", padding: "24px" }}>
                    <h3>أهلاً! كيف أقدر أساعدك ؟ 👋</h3>
                    <p>جرب إحدى هذه الاقتراحات :</p>

                    <div className="d-flex gap-2 flex-wrap p-3" >
                        {quickReplies.map((q, i) => (
                            <span
                                key={i}
                                onClick={() => { setInput(q); handleSend(); }}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '12px',
                                    backgroundColor: '#ffffff',
                                    color: '#2A5CAF',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 500
                                }}
                            >
                                {q}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="messages flex-column d-flex p-4" style={{ flex: 1, maxHeight: '500px', overflowY: 'auto', gap: '12px', backgroundColor: '#F6F7FB' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: msg.from === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: msg.from === 'user' ? '#DFDFDF' : '#2A5CAF', color: msg.from === 'user' ? "black" : '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', flexShrink: 0 }}>
                                {msg.from === 'user' ? 'أنت' : 'AI'}
                            </div>
                            <div
                                className="message shadow-sm"
                                style={{
                                    backgroundColor: msg.from === 'user' ? '#2A5CAF' : '#ffffff',
                                    color: msg.from === 'user' ? '#fff' : '#111827',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    maxWidth: '70%',
                                    wordWrap: 'break-word',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}>
                                <span>{msg.text}</span>
                                <span style={{ fontSize: '10px', color: msg.from === 'user' ? '#D1D5DB' : '#6B7280', alignSelf: 'flex-end' }}>{msg.time}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                </div>

                <div className="d-flex p-3 gap-2" style={{ borderTop: '1px solid #E5E7EB', backgroundColor: '#ffffff' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            borderRadius: '12px',
                            border: '1px solid #D1D5DB',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        style={{
                            backgroundColor: '#2A5CAF',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <FiSend size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatBot;