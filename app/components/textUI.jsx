import { useState } from "react";

export const TextUI = () => {
  const [location, setLocation] = useState("");

  return (
    <>
      <h2>条件入力</h2>
      <input
        type="text"
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
        }}
      />
    </>
  );
};
