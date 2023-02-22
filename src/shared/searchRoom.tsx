export default (search: string) => {
  return (x) => {
    const room = x.data.name + ' ' + x.id;
    return room.toLowerCase().includes(search.toLowerCase()) || !search;
  };
};
