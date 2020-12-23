import React from "react";
import Map from "./Map";
import axios from "axios";
import SideInfo from "./SideInfo";
import Portal from "./Portal";
import FeedbackForm from "./FeedbackForm";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      availableCountries: [],
      availableCountryCodes: [],
      chosenCountry: null,
      isAllowedInto: [],
      cachedAllowed: [],
    }

    this.handleCountryChange = this.handleCountryChange.bind(this);
  }

  async componentDidMount() {
    // Get all the countries we have info for
    try {
      const res = await axios.get('/api/country/');

      let codes = res.data.map((c) => { return c.code });

      this.setState({ availableCountries: res.data, availableCountryCodes: codes });
    } catch (error) {
      console.log(error);
    }
  }

  async handleCountryChange(e) {
    // 2 char code of chosen country, e.g. US
    let newChosen = e.target.value;

    // Check if we have it cached already
    const cachedRes = this.state.cachedAllowed.find((c) => {
      return c.code == newChosen;
    });
    if (cachedRes) {
      this.setState({ chosenCountry: newChosen, isAllowedInto: cachedRes.cache });
      return;
    }

    // If no cache then make an api call
    try {
      const res = await axios.get('/api/country/' + newChosen + '/allowed/');

      let newCache = this.state.cachedAllowed.slice();
      newCache.push({ "code": newChosen, "cache": res.data });

      this.setState({ chosenCountry: newChosen, isAllowedInto: res.data, cachedAllowed: newCache });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="container-fluid bg-white">
        <div className="row p-0">
          <div className="col-sm-4 side-info p-0 d-flex align-items-end flex-column">
            <SideInfo
              availableCountries={this.state.availableCountries}
              chosenCountry={this.state.chosenCountry}
              isAllowedInto={this.state.isAllowedInto}
              onChange={this.handleCountryChange}
            />
          </div>
          <div className="col-sm-8 p-0">
            <Map
              availableCountries={this.state.availableCountryCodes}
              chosenCountry={this.state.chosenCountry}
              isAllowedInto={this.state.isAllowedInto}
              onCountryClick={this.handleCountryChange}
            />
          </div>
        </div>

        <Portal portalRoot="feedback-portal">
          <FeedbackForm />
        </Portal>
      </div>
    );
  }
}

export default App;