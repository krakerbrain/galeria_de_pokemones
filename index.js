const axios = require("axios");
const http = require("http");
const fs = require("fs");

async function pokemonesGet() {
  const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=75");
  return data.results;
}
async function pokemonesGet2() {
  const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=75&offset=150");
  return data.results;
}

async function getFullData(name) {
  const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  return data;
}

http
  .createServer((req, res) => {
    let pokemonesPromesas = [];
    let listaPokemones = [];

    if (req.url == "/pokemones") {
      pokemonesGet().then((results) => {
        results.forEach((p) => {
          let pokemonName = p.name;
          pokemonesPromesas.push(getFullData(pokemonName));
        });
        pokemonesGet2().then((results) => {
          results.forEach((p) => {
            let pokemonName = p.name;
            pokemonesPromesas.push(getFullData(pokemonName));
          });
          Promise.all(pokemonesPromesas).then((data) => {
            data.forEach((p) => {
              listaPokemones.push({ nombre: p.name, img: p.sprites.front_default });
            });
            res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
            let yeison = JSON.stringify(listaPokemones);
            res.end(yeison);
          });
        });
      });
    }
  })
  .listen(3000, () => console.log("Escuchando el puerto 3000"));
