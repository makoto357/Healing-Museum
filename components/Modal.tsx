import { createPortal } from "react-dom";
const Modal = ({ onClose, children }) => {
  return createPortal(
    <div className="StyledModalOverlay">
      <style jsx>
        {`
          .StyledModalOverlay {
            padding-top: 10px;
          }
          .StyledModalHeader {
            display: flex;
            justify-content: flex-end;
            font-size: 25px;
          }
          .StyledModal {
            background: white;
            width: 500px;
            height: 600px;
            border-radius: 15px;
            padding: 15px;
          }
          .StyledModalOverlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: transparent;
          }
        `}
      </style>
      <div className="StyledModal">
        <div className="StyledModalHeader">
          <div onClick={onClose}>x</div>
        </div>
        <div className="StyledModalBody">{children}</div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
