import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DropdownButton, Dropdown } from "react-bootstrap";

class ComparatorDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownItems: "",
    };
  }

  getDropdownItems() {
    const dropdownItems = (
      <>
        <Dropdown.Item name="Greater">{">"}</Dropdown.Item>
        <Dropdown.Item name="Greater">{"<"}</Dropdown.Item>
      </>
    );
    this.setState({ dropdownItems });
  }

  componentDidMount() {
    this.getDropdownItems();
  }

  render() {
    return (
      <DropdownButton
        size="sm"
        id="dropdown-basic-button"
        title="Comparator"
        className="inline"
      >
        {this.state.dropdownItems}
      </DropdownButton>
    );
  }
}

export default ComparatorDropdown;
