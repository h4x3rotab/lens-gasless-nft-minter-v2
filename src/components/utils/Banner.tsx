import ErrorAlertComponent from "./ErrorAlertComponent";
import ProgressAlertComponent from "./ProgressAlertComponent";
import StartAlertComponent from "./StartAlertComponent";
import SuccessAlertComponent from "./SuccessAlertComponent";

export const BANNER_STATES = {
  NONE: "NONE",
  MINT_STARTED: "MINT_STARTED",
  MINT_SUCCESS: "MINT_SUCCESS",
  TRANSFER_SUCCESS: "TRANSFER_SUCCESS",
  ERROR: "ERROR",
  USER_OP_HASH: "USER_OP_HASH",
  TX_HASH: "TX_HASH",
};

export function Banner({
  state,
  userOpHash,
  txHash,
  recipientAddress,
  errorMessage,
  successMessage,
}: any) {
  switch (state) {
    case BANNER_STATES.MINT_STARTED:
      return <StartAlertComponent />;

    case BANNER_STATES.MINT_SUCCESS:
      return (
        <SuccessAlertComponent
          message={"You successfully minted an NFT w/o paying gas!"}
          hash={txHash}
        />
      );

    case BANNER_STATES.TRANSFER_SUCCESS:
      return (
        <SuccessAlertComponent
          message={`You successfully transferred an NFT to ${recipientAddress}.`}
          hash={txHash}
        />
      );

    case BANNER_STATES.ERROR:
      return <ErrorAlertComponent errorMessage={errorMessage} />;

    case BANNER_STATES.USER_OP_HASH:
      return <ProgressAlertComponent hash={userOpHash} />;

    case BANNER_STATES.TX_HASH:
      return <ProgressAlertComponent hash={txHash} />;

    default:
      return null;
  }
}
