import { SearchMapComponent } from "../components/SearchMap.jsx";
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
        KOTABi ~孤旅~
      </h1>
      <h2>Search on Google Map</h2>
      <SearchMapComponent />
      <Footer />
    </div>
  );
}
