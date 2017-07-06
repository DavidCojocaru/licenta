// returneaza un obiect care contine array-uri cu obiectele de un anumit size
export const getSizesForGames = games => {
  return games.reduce((acc, game) => {
    if (!acc[game.gameSize]) {
      acc[game.gameSize] = [];
    }
    acc[game.gameSize].push(game);
    return acc;
  }, {});
};

//pentru fiecare keys creeaza un obiect
// 0: Obiect, 1: Obiect, ....
export const gamesToArray = games => {
  const keys = Object.keys(games);
  return keys.map(key => games[key]);
};

//return jocurile dupa un anumit size
export const filterGamesBySize = (size, games) => {
  if (!Array.isArray(games)) {
    games = gamesToArray(games);
  }
  return games.filter(game => game.gameSize === size);
};

//return games by user
export const filterGamesByUser = (user, games) => {
  if (!Array.isArray(games)) {
    games = gamesToArray(games);
  }
  return games.filter(game => game.user === user);
};
