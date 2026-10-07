import {
  useAuth,
} from "../../hooks/useAuth.js";


export default function MateriListPage() {

  const {
    user,
    role,
    logout,
  } = useAuth();


  return (
    <main className="materi-page">

      <h1>
        Daftar Materi
      </h1>


      <p>
        Selamat datang,{" "}

        <strong>
          {user?.nama || role}
        </strong>
      </p>


      <p>
        Role:{" "}

        <strong>
          {role}
        </strong>
      </p>


      <button
        type="button"
        onClick={logout}
      >
        Logout
      </button>

    </main>
  );
}