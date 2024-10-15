import { SearchMapComponent } from "../components/SearchMap.jsx";
import "../styles/style.css";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";

export default function SearchMap() {
  return (
    <div>
      <Header />
      <h1
        style={{
          borderBottom: "0.5rem solid",
          borderColor: "rgb(260,70,0)",
          fontSize: "50px",
        }}
      >
        KOTABI ~孤旅~
      </h1>
      <div className="googlebackground">
        <div className="toumei">
          <h2>Search on Google Map</h2>
          <SearchMapComponent />
          <Footer />
        </div>
      </div>
    </div>
  );
}
