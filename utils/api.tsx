const api = {
  hostname: "https://collectionapi.metmuseum.org/public/collection/v1/",
  async getArtist(keyword) {
    const response = await fetch(`${this.hostname}/search?q=${keyword}`);
    return await response.json();
  },
  async getArtworks(objectID) {
    const response = await fetch(`${this.hostname}/objects/${objectID}`);
    return await response.json();
  },
};
export default api;
