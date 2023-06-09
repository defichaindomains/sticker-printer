import React, { useEffect, useState } from "react";
import styled, { css, ThemeProvider } from "styled-components";
import {
  Button,
  ThorinGlobalStyles,
  darkTheme,
  lightTheme,
} from "@ensdomains/thorin";
import { toBlob } from "html-to-image";
import { saveAs } from "file-saver";
import { isElementReady } from "./utils/isElementReady";
import ENSCard from "./Card";
import SearchProfile from "./Search";

const ButtonStack = styled.div(
  ({ theme }) => css`
    margin: ${theme.space["4"]};
  `
);

const App = () => {
  const [profile, setProfile] = useState();
  const [render, setRender] = useState();
  useEffect(() => {
    isElementReady("#ensCardAvatar").then((avatar) => {
      const card =
        avatar.parentElement.parentElement.parentElement.parentElement;
      avatar.onload = () => printElement(card);
      avatar.onerror = () => setTimeout(() => printElement(card), 1000);
    });
  }, [profile]);

  const printElement = (target) => {
    toBlob(target).then(function (blob) {
      setRender(URL.createObjectURL(blob));
    });
  };

  const shareCard = async () => {
    const blob = await fetch(render).then((r) => r.blob());
    try {
      navigator
        .share({
          files: [
            new File([blob], "ens.png", {
              type: blob.type,
            }),
          ],
        })
        .then(() => {})
        .catch((error) => {
          // suppress if canceled
          if (error.includes("canceled")) return;
          alert("Sharing failed" + error);
        });
    } catch {
      console.log(`Your system doesn't support sharing files.`);
      saveAs(blob);
    }
  };
  return (
    <ThemeProvider theme={lightTheme}>
      <ThorinGlobalStyles />
      <div
        style={{
          marginBlock: "48px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "Poppins",
            fontSize: 36,
            color: "#965CFF",
          }}
        >
          Defichain Domains Sticker Printer
        </h1>
      </div>
      <SearchProfile
        setProfile={setProfile}
        setRender={setRender}
        isFetching={!render && profile}
      />
      {!render && profile ? (
        <div>
          <ENSCard profile={profile} />
        </div>
      ) : (
        ""
      )}
      {render && profile && (
        <div style={{ padding: "1rem" }}>
          <img
            id="ensCardRender"
            src={render}
            width="100%"
            style={{ maxWidth: "580px" }}
          />
        </div>
      )}
      <ButtonStack>
        <Button
          onClick={shareCard}
          style={{
            visibility: render ? "visible" : "hidden",
            backgroundColor: "#965CFF",
            fontFamily: "Poppins",
          }}
        >
          Print
        </Button>
      </ButtonStack>
    </ThemeProvider>
  );
};

export default App;
