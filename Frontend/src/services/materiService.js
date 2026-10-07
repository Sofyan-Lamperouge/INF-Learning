import { api } from "./api.js";


export function getMateriList(
  category
) {

  const query = category
    ? `?category=${encodeURIComponent(
        category
      )}`
    : "";


  return api.get(
    `/materi${query}`
  );
}


export function getCategories() {

  return api.get(
    "/materi/categories"
  );
}