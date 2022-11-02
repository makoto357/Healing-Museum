import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Modal = ({ show, onClose, children, title }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
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
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.5);
          }
        `}
      </style>
      <div className="StyledModal">
        <div className="StyledModalHeader">
          <a href="#" onClick={handleCloseClick}>
            x
          </a>
        </div>
        {title && <div>{title}</div>}
        <div className="StyledModalBody">{children}</div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
};

export default Modal;
