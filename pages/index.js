import React from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  Box,
  Button,
  //Anchor,
  Footer,
  Grommet,
  Heading,
  Image,
  Main,
  Meter,
  Text,
  TextInput
} from "grommet";
import { Pokedex } from "pokeapi-js-wrapper";

import Spinner from "../components/Spinner";

const P = new Pokedex();

export default function Home() {
  const [input, setInput] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const setValue = async input => {
    setInput(input);
    setIsLoading(true);
    try {
      const pok = await P.getPokemonFormByName(input.toLowerCase());
      if (pok && pok.hasOwnProperty("sprites")) {
        setImageUrl(pok.sprites.front_default);
        setIsLoading(false);
      } else {
        console.log("not found");
      }
    } catch {
      setImageUrl("");
    }
    if (input === "") {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setInput("");
    setIsLoading(false);
    setImageUrl("");
  };

  return (
    <Grommet>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main pad="large">
        <Heading color="neutral-2">Look up a Pokemon!</Heading>
        <Box direction="row" gap="medium">
          <TextInput
            placeholder="type here"
            value={input}
            onChange={event => setValue(event.target.value)}
          />
          <Button primary label="Clear" onClick={clear} />
        </Box>
        <br />
        {input && imageUrl ? <Image fit="contain" src={imageUrl} /> : <span />}
        {isLoading ? <Spinner /> : <span />}
      </Main>

      <Footer background="brand" pad="medium" fill="horizontal">
        <Text>Straight out a Griffy's head.</Text>
      </Footer>
    </Grommet>
  );
}
