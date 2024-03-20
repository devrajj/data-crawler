import React, { useEffect } from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: ${({ backdropZIndex }) => (backdropZIndex ? backdropZIndex : "6")};
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  position: fixed;
  padding: 16px;
  z-index: ${({ backdropZIndex }) =>
    backdropZIndex ? backdropZIndex + 1 : "7"};
  width: fit-content;
  ${({ overflowFlag }) =>
    overflowFlag
      ? `  &::-webkit-scrollbar {
    width: 2px;
    height:2px;
  }
&::-webkit-scrollbar-thumb {
    border-radius: 20px;
    background: #c4c4c4;
  }`
      : ""}
`;

export default function Modal({
  children,
  isOpen = true,
  backdrop = true,
  onClose,
  modalStyle,
  backdropStyle,
  overflowFlag = false,
  backdropZIndex,
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  if (!isOpen) return null;
  const backdropProps = {
    style: backdropStyle,
    onClick: onClose,
    backdropZIndex: backdropZIndex,
  };

  return (
    <>
      {backdrop && <Backdrop {...backdropProps} />}
      <ModalContainer style={modalStyle} backdropZIndex={backdropZIndex}>
        {children}
      </ModalContainer>
    </>
  );
}
