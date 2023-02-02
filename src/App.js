import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};
function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name) {
      showAlert(true, "danger", "Please Enter An Item");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditId(null);
      setIsEditing(false);
      showAlert(true, "success", "value changed");
    } else {
      showAlert(true, "success", "Item Added To The List");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  const handleOnchange = (event) => {
    setName(event.target.value);
  };
  const handleClearItems = () => {
    setList([]);
    showAlert(true, "danger", "Empty List");
  };
  const clearItem = (id) => {
    const newListItems = list.filter((item) => {
      return item.id !== id;
    });
    showAlert(true, "danger", "Item Deleted");
    setList(newListItems);
  };
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, msg, type });
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => {
      return item.id === id;
    });
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);
  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Grocery Bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g milk"
            onChange={handleOnchange}
            value={name}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>

      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} clearItem={clearItem} editItem={editItem} />
          <button className="clear-btn" onClick={handleClearItems}>
            clear Items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
