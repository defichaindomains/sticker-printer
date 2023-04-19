import React, { useRef, useState } from "react";
import { Button, Input, darkTheme, lightTheme } from "@ensdomains/thorin";
import styled, { css } from "styled-components";
import { retrieveProfile } from "./utils/retrieveProfile";

const ButtonStack = styled.div(
  () => css`
    position: relative;
    width: 100%;
  `
);

const Container = styled.div(
  ({ theme }) => css`
    margin: ${theme.space["4"]};
    padding: ${theme.space["6"]};
    border-radius: ${theme.radii["2xLarge"]};
    border: ${theme.space.px} solid ${theme.colors.borderTertiary};
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.space["3"]};
    flex-gap: ${theme.space["3"]};
  `
);

const TextStack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.space["1"]};
    flex-gap: ${theme.space["1"]};
  `
);

const appStatus = (isLoading, isFetching, inputENSRef) => {
  if (isFetching) return `Fetching...`;
  if (isLoading) return `Searching...`;
  if (inputENSRef.current) inputENSRef.current.value = "";
  return "Search";
};

const SearchProfile = ({ setProfile, setRender, isFetching }) => {
  const [isLoading, setLoading] = useState(false);
  const inputENSRef = useRef();

  const searchENS = async (event) => {
    event.preventDefault();
    let _name = inputENSRef.current.value;
    if (!_name) return;
    if (!_name.endsWith(".dfi")) {
      _name = _name + ".dfi";
    }
    setProfile(null);
    setRender(null);
    setLoading(true);
    const profile = await retrieveProfile(_name);
    console.log("profile", profile);
    setProfile(profile);
    setLoading(false);
    // event.target.reset();
  };

  return (
    <form onSubmit={searchENS}>
      <Container theme={lightTheme}>
        <Input
          ref={inputENSRef}
          label="Type a Defichain Domain Name"
          placeholder="stefano.dfi"
          autoComplete="off"
          autoFocus
          required
          style={{ fontFamily: "Poppins" }}
        />
        <TextStack></TextStack>
        <ButtonStack>
          <Button
            type="submit"
            loading={isLoading || isFetching}
            style={{ backgroundColor: "#965CFF", fontFamily: "Poppins" }}
          >
            {appStatus(isLoading, isFetching, inputENSRef)}
          </Button>
        </ButtonStack>
      </Container>
    </form>
  );
};

export default SearchProfile;
