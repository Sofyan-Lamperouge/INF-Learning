const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api/v1";


export class ApiError extends Error {
  constructor(
    message,
    status = 0,
    details = null
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}


export async function request(
  path,
  options = {}
) {

  const token =
    localStorage.getItem("token");


  const headers = {
    ...(options.body
      ? {
          "Content-Type":
            "application/json",
        }
      : {}),

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),

    ...options.headers,
  };


  let response;


  try {

    response = await fetch(
      `${BASE_URL}${path}`,
      {
        ...options,
        headers,
      }
    );

  } catch (error) {

    throw new ApiError(
      "Gagal terhubung ke server. Pastikan Backend sedang berjalan.",
      0,
      error
    );
  }


  let data = null;


  try {

    data = await response.json();

  } catch {
    data = null;
  }


  if (response.status === 401) {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );
  }


  if (!response.ok) {

    let message =
      `Request gagal (${response.status})`;


    if (Array.isArray(data?.detail)) {

      message = data.detail
        .map(
          (item) =>
            item.msg
        )
        .join(", ");

    } else if (data?.detail) {

      message = data.detail;

    } else if (data?.message) {

      message = data.message;
    }


    throw new ApiError(
      message,
      response.status,
      data
    );
  }


  return data;
}


export const api = {

  get(path) {

    return request(path);
  },


  post(path, body) {

    return request(
      path,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
  },


  put(path, body) {

    return request(
      path,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );
  },


  delete(path) {

    return request(
      path,
      {
        method: "DELETE",
      }
    );
  },

};