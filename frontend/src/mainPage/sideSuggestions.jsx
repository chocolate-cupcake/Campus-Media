import { ListGroup, Image, Button, ButtonGroup } from "react-bootstrap";
import brianImg from "../assets/brianImg.jpg";
import stewieImg from "../assets/stewieImg.jpg";
import peterImg from "../assets/peterImg.jpg";
function SideSuggestions() {
  const suggestions = [
    { username: "Brian Griffin", image: brianImg },
    { username: "Stewie Griffin", image: stewieImg },
    { username: "Peter Griffin", image: peterImg },
  ];

 function handleAdd(){
    console.log("You added a friend")
 }

  function handleRemove(){
    console.log("You removed a suggestion")
 }


  return (
    <aside
      className="bg-light p-3"
      style={{ width: "350px", minHeight: "100vh" }}
    >
      <h5>Suggestions</h5>
      <ListGroup>
        {suggestions.map((s, idx) => (
          <ListGroup.Item
            key={idx}
            action
            className="d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center gap-2">
              <Image src={s.image} roundedCircle width={30} height={30} />
              <span>{s.username}</span>
            </div>
            <div className="d-flex gap-1">
                <ButtonGroup size="sm" className="mb-2">
              <Button size="sm" variant="primary" onClick={handleAdd}>
                Add
              </Button>
              <Button size="sm" variant="danger" onClick={handleRemove}>
                -
              </Button>
              </ButtonGroup>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </aside>
  );
}

export default SideSuggestions;
