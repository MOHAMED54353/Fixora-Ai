import { useNavigate } from "react-router";


const Aibtn = () => {
  const navigate = useNavigate();
  return (
    <button
      className="chat-bot-button"
      style={{
        position: 'fixed',
        bottom: '50px',
        left: '90px',
        width: '60px',
        height: '50px',
        padding: '12px',
        backgroundColor: '#2A5CAF',
        border: 'none',
        borderRadius: '16px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(42, 92, 175, 0.3)',
        zIndex: 1000,
      }}
      onClick={()=> navigate("/chatbot")}
    >
      <i className="fas fa-robot" style={{ fontSize: '24px', color: 'white' }} />
    </button>
  );
};
export default Aibtn;