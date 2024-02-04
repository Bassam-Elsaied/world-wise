import { useNavigate } from "react-router-dom";
import styles from "./User.module.css";
import { useAuth } from "../context/FakeAuthContext";

function User() {
  const { user , logOut } = useAuth();
  const navigate = useNavigate();

  function handleClick() {
    logOut();
    navigate("/");
  }

  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.name} />
      <span>Welcome, {user.name}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;
