import React from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Footer,
  Grommet,
  Heading,
  Image,
  List,
  Main,
  Text,
  TextInput
} from "grommet";
import { Pokedex } from "pokeapi-js-wrapper";

import Spinner from "../components/Spinner";

const P = new Pokedex();

const printSprites = sprites => {
  const formatted = [];
  Object.entries(sprites).map(s => {
    if (typeof s[1] === "string") {
      formatted.push(s[1]);
    }
  });
  return formatted;
};

export default function Home() {
  const [input, setInput] = React.useState("");
  const [pokemon, setPokemon] = React.useState(undefined);
  const [imageUrl, setImageUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const setValue = async input => {
    setInput(input);
    setIsLoading(true);
    //console.log(await P.getPokemonsList());
    try {
      const pok = await P.getPokemonByName(input.toLowerCase());
      if (pok) {
        Object.entries(pok.sprites).map(s => {
          if (typeof s[1] === "string") {
            console.log(s[1]);
          } else {
            console.log("not a string");
          }
        });
        setPokemon(pok);
        console.log(pok);
        setImageUrl(
          "https://pokeres.bastionbot.org/images/pokemon/" + pok.id + ".png"
        );
        setIsLoading(false);
      } else {
        console.log("not found");
      }
    } catch {
      setImageUrl("");
      setPokemon(undefined);
    }
    if (input === "") {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setInput("");
    setIsLoading(false);
    setImageUrl("");
    setPokemon(undefined);
  };

  return (
    <Grommet>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main pad="large">
        <Heading color="neutral-4">Look up a Pokemon!</Heading>
        <Box direction="row" gap="medium">
          <TextInput
            placeholder="type here"
            value={input}
            onChange={event => setValue(event.target.value)}
          />
          <Button primary label="Clear" onClick={clear} />
        </Box>
        <br />
        {input && pokemon ? (
          <>
            <Box direction="row">
              <Box height="medium" width="medium">
                <Image fit="contain" src={imageUrl} />
              </Box>
              <Card width="small" background="light-1">
                <CardHeader pad="small">
                  <Text weight="bold" color="neutral-4">
                    {pokemon.name.charAt(0).toUpperCase() +
                      pokemon.name.slice(1)}
                  </Text>
                </CardHeader>
                <CardBody>
                  <Heading margin="small" level={5}>
                    Abilities:
                  </Heading>
                  <List
                    margin="xsmall"
                    pad="xxsmall"
                    primaryKey={a => a.ability.name}
                    data={pokemon.abilities}
                  />
                  <br />
                  <Heading margin="small" level={5}>
                    Types:
                  </Heading>
                  <List
                    margin="xsmall"
                    pad="xxsmall"
                    primaryKey={t => t.type.name}
                    data={pokemon.types}
                  />
                </CardBody>
              </Card>
            </Box>
            <Box alignSelf="start">
              {printSprites(pokemon.sprites).map(s => (
                <Image fit="contain" src={s} key={s} />
              ))}
            </Box>
          </>
        ) : (
          <span />
        )}
        {isLoading ? <Spinner /> : <span />}
      </Main>

      <Footer background="brand" pad="medium" fill="horizontal">
        <Text>Straight out of Griffy's fore head.</Text>
      </Footer>
    </Grommet>
  );
}
