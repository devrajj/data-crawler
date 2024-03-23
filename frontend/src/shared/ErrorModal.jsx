import styled from "styled-components";
import Modal from "./Modal";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  border-radius: 8px;
  padding: 16px 32px 16px 32px;
  border-color: black;
`;
const ErrorIcon = styled.img`
  width: 136px;
  height: 136px;
`;
const ErrorText = styled.span`
  font-family: "Open Sans", sans-serif;
  color: #08111c;
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0.15px;
  color: "475467";
  width: 450px;
  text-align: center;
  margin-top: 8px;
`;
const OkayButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;
const Headline4 = styled.span`
  font-size: 32px;
  letter-spacing: 0.5px;
  color: #08111c;
  font-family: "Outfit", sans-serif;
  font-weight: 400;
`;

const ButtonCTA = styled.button`
  display: flex;
  width: 130px;
  height: 42px;
  justify-content: center;
  align-items: center;
`;

export default function ErrorModal({
  title = "Oops!",
  text = "Something went wrong",
  buttonText = "Okay",
  customAction,
  inland = false,
  isError = true,
}) {
  let children = (
    <ErrorContainer>
      {isError ? (
        <ErrorIcon src="/animations/warning.gif" />
      ) : (
        <ErrorIcon src="/icons/check-circle.svg" />
      )}
      <Headline4>{title}</Headline4>
      <ErrorText>{text}</ErrorText>
      {!inland && (
        <OkayButton>
          <ButtonCTA
            onClick={() => {
              customAction();
            }}
          >
            {buttonText}
          </ButtonCTA>
        </OkayButton>
      )}
    </ErrorContainer>
  );
  return inland ? children : <Modal children={children} />;
}
